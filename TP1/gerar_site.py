import json
import os
import re
import shutil
import unicodedata
from html import escape
from typing import Optional


BASE_DIR = os.path.dirname(__file__)


def caminho(*partes: str) -> str:
    return os.path.join(BASE_DIR, *partes)


def abrir_json(nome_ficheiro: str):
    with open(caminho(nome_ficheiro), encoding="utf-8") as f:
        data = json.load(f)
    return data


def criar_pasta(path_relativo: str):
    path = caminho(path_relativo)
    if not os.path.exists(path):
        os.mkdir(path)
    else:
        shutil.rmtree(path)
        os.mkdir(path)


def escreve_no_ficheiro(path_relativo: str, content: str):
    with open(caminho(path_relativo), "w", encoding="utf-8") as f:
        f.write(content)


def slugify(texto: str) -> str:
    normalizado = (
        unicodedata.normalize("NFKD", str(texto))
        .encode("ascii", "ignore")
        .decode("ascii")
    )
    slug = re.sub(r"[^a-zA-Z0-9]+", "_", normalizado).strip("_").lower()
    return slug or "x"


def pagina(titulo: str, corpo_html: str, link_voltar: Optional[str] = None) -> str:
    voltar_html = ""
    if link_voltar:
        voltar_html = f'<p><a href="{escape(link_voltar)}">Voltar</a></p>'
    return f"""
<!doctype html>
<html lang=\"pt\">
  <head>
    <meta charset=\"utf-8\"/>
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/>
    <title>{escape(titulo)}</title>
    <link rel=\"stylesheet\" href=\"style.css\"/>
  </head>
  <body>
    <header>
      <h1>{escape(titulo)}</h1>
      {voltar_html}
      <hr/>
    </header>
    <main>
      {corpo_html}
    </main>
  </body>
</html>
"""


def fmt_reparacao_label(rep: dict) -> str:
    data = rep.get("data", "")
    nif = rep.get("nif", "")
    nome = rep.get("nome", "")
    viatura = rep.get("viatura", {}) or {}
    matricula = viatura.get("matricula", "")
    return f"{data} — {nome} ({nif}) — {matricula}".strip()


def main():
    dataset = abrir_json("dataset_reparacoes.json")
    reparacoes = dataset.get("reparacoes", [])

    criar_pasta("output")

    escreve_no_ficheiro(
        "output/style.css",
        """
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif; margin: 24px; line-height: 1.4; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
th { background: #f6f6f6; text-align: left; }
a { color: #0b57d0; text-decoration: none; }
a:hover { text-decoration: underline; }
.muted { color: #666; }
""".lstrip(),
    )

    # Índices auxiliares
    tipos_intervencao: dict[str, dict] = {}
    marcas_modelos: dict[tuple[str, str], dict] = {}
    reparacoes_com_id: list[dict] = []

    for idx, rep in enumerate(reparacoes, start=1):
        rep_id = f"rep_{idx:05d}"
        rep2 = dict(rep)
        rep2["_id"] = rep_id
        reparacoes_com_id.append(rep2)

        viatura = rep.get("viatura", {}) or {}
        marca = str(viatura.get("marca", ""))
        modelo = str(viatura.get("modelo", ""))
        matricula = str(viatura.get("matricula", ""))

        chave_mm = (marca, modelo)
        if chave_mm not in marcas_modelos:
            marcas_modelos[chave_mm] = {
                "marca": marca,
                "modelo": modelo,
                "matriculas": set(),
                "reparacoes": [],
            }
        if matricula:
            marcas_modelos[chave_mm]["matriculas"].add(matricula)
        marcas_modelos[chave_mm]["reparacoes"].append(rep_id)

        for interv in rep.get("intervencoes", []) or []:
            codigo = str(interv.get("codigo", "")).strip()
            if not codigo:
                continue
            if codigo not in tipos_intervencao:
                tipos_intervencao[codigo] = {
                    "codigo": codigo,
                    "nome": str(interv.get("nome", "")),
                    "descricao": str(interv.get("descricao", "")),
                    "reparacoes": set(),
                }
            tipos_intervencao[codigo]["reparacoes"].add(rep_id)

    # ------------------ Página principal ------------------
    index_body = """
<p class=\"muted\">Website gerado a partir do dataset de reparações.</p>
<ul>
  <li><a href=\"reparacoes.html\">Listagem das reparações</a></li>
  <li><a href=\"intervencoes.html\">Listagem dos tipos de intervenção</a></li>
  <li><a href=\"marcas_modelos.html\">Listagem de marcas/modelos</a></li>
</ul>
""".strip()
    escreve_no_ficheiro("output/index.html", pagina("Exploração do Dataset de Reparações", index_body))

    # ------------------ Listagem de reparações ------------------
    linhas = []
    for rep in reparacoes_com_id:
        viatura = rep.get("viatura", {}) or {}
        rep_id = rep["_id"]
        linhas.append(
            "<tr>"
            f"<td><a href=\"{escape(rep_id)}.html\">{escape(rep.get('data', ''))}</a></td>"
            f"<td>{escape(str(rep.get('nif', '')))}</td>"
            f"<td>{escape(rep.get('nome', ''))}</td>"
            f"<td>{escape(str(viatura.get('marca', '')))}</td>"
            f"<td>{escape(str(viatura.get('modelo', '')))}</td>"
            f"<td>{escape(str(rep.get('nr_intervencoes', '')))}</td>"
            "</tr>"
        )

    reparacoes_body = (
        "<table>"
        "<thead><tr><th>Data</th><th>NIF</th><th>Nome</th><th>Marca</th><th>Modelo</th><th>Nº Intervenções</th></tr></thead>"
        "<tbody>"
        + "\n".join(linhas)
        + "</tbody></table>"
    )
    escreve_no_ficheiro("output/reparacoes.html", pagina("Listagem das Reparações", reparacoes_body, "index.html"))

    # ------------------ Página de cada reparação ------------------
    mm_to_page: dict[tuple[str, str], str] = {}
    for marca, modelo in marcas_modelos.keys():
        mm_to_page[(marca, modelo)] = f"mm_{slugify(marca)}__{slugify(modelo)}.html"

    for rep in reparacoes_com_id:
        viatura = rep.get("viatura", {}) or {}
        marca = str(viatura.get("marca", ""))
        modelo = str(viatura.get("modelo", ""))
        mm_page = mm_to_page.get((marca, modelo))

        interv_links = ""
        for interv in rep.get("intervencoes", []) or []:
            codigo = str(interv.get("codigo", "")).strip()
            nome = str(interv.get("nome", ""))
            if codigo:
                interv_links += (
                    "<li>"
                    f"<a href=\"int_{escape(codigo)}.html\">{escape(codigo)}</a> — {escape(nome)}"
                    "</li>"
                )

        mm_html = ""
        if mm_page:
            mm_html = (
                "<p>Viatura: "
                f"<a href=\"{escape(mm_page)}\">{escape(marca)} — {escape(modelo)}</a>"
                f" <span class=\"muted\">({escape(str(viatura.get('matricula', '')))})</span>"
                "</p>"
            )

        corpo = f"""
{mm_html}
<table>
  <tr><th>Data</th><td>{escape(rep.get("data", ""))}</td></tr>
  <tr><th>NIF</th><td>{escape(str(rep.get("nif", "")))}</td></tr>
  <tr><th>Nome</th><td>{escape(rep.get("nome", ""))}</td></tr>
  <tr><th>Marca</th><td>{escape(str(marca))}</td></tr>
  <tr><th>Modelo</th><td>{escape(str(modelo))}</td></tr>
  <tr><th>Matrícula</th><td>{escape(str(viatura.get("matricula", "")))}</td></tr>
  <tr><th>Nº Intervenções</th><td>{escape(str(rep.get("nr_intervencoes", "")))}</td></tr>
</table>

<h3>Intervenções</h3>
<ul>
  {interv_links or '<li class="muted">(sem intervenções)</li>'}
</ul>
""".strip()

        titulo = f"Reparação — {fmt_reparacao_label(rep)}"
        escreve_no_ficheiro(f"output/{rep['_id']}.html", pagina(titulo, corpo, "reparacoes.html"))

    # ------------------ Listagem de tipos de intervenção ------------------
    codigos = sorted(tipos_intervencao.keys())
    linhas = []
    for codigo in codigos:
        info = tipos_intervencao[codigo]
        linhas.append(
            "<tr>"
            f"<td><a href=\"int_{escape(codigo)}.html\">{escape(codigo)}</a></td>"
            f"<td>{escape(info.get('nome', ''))}</td>"
            f"<td>{escape(info.get('descricao', ''))}</td>"
            "</tr>"
        )

    interv_body = (
        "<table>"
        "<thead><tr><th>Código</th><th>Nome</th><th>Descrição</th></tr></thead>"
        "<tbody>"
        + "\n".join(linhas)
        + "</tbody></table>"
    )
    escreve_no_ficheiro("output/intervencoes.html", pagina("Tipos de Intervenção", interv_body, "index.html"))

    # ------------------ Página de cada tipo de intervenção ------------------
    rep_por_id = {rep["_id"]: rep for rep in reparacoes_com_id}
    for codigo in codigos:
        info = tipos_intervencao[codigo]
        reps = sorted(info["reparacoes"])

        lista_reps = ""
        for rep_id in reps:
            rep = rep_por_id.get(rep_id, {})
            lista_reps += (
                "<li>"
                f"<a href=\"{escape(rep_id)}.html\">{escape(fmt_reparacao_label(rep))}</a>"
                "</li>"
            )

        corpo = f"""
<table>
  <tr><th>Código</th><td>{escape(info.get("codigo", ""))}</td></tr>
  <tr><th>Nome</th><td>{escape(info.get("nome", ""))}</td></tr>
  <tr><th>Descrição</th><td>{escape(info.get("descricao", ""))}</td></tr>
</table>

<h3>Reparações onde foi realizada</h3>
<ul>
  {lista_reps or '<li class="muted">(sem reparações)</li>'}
</ul>
""".strip()

        escreve_no_ficheiro(
            f"output/int_{codigo}.html",
            pagina(f"Intervenção {codigo}", corpo, "intervencoes.html"),
        )

    # ------------------ Listagem de marcas e modelos ------------------
    mm_ordenado = sorted(marcas_modelos.values(), key=lambda x: (x["marca"].lower(), x["modelo"].lower()))
    linhas = []
    for mm in mm_ordenado:
        marca = mm["marca"]
        modelo = mm["modelo"]
        ficheiro_mm = mm_to_page[(marca, modelo)]
        nr_carros = len(mm["matriculas"])
        linhas.append(
            "<tr>"
            f"<td><a href=\"{escape(ficheiro_mm)}\">{escape(marca)}</a></td>"
            f"<td>{escape(modelo)}</td>"
            f"<td>{escape(str(nr_carros))}</td>"
            "</tr>"
        )

    mm_body = (
        "<table>"
        "<thead><tr><th>Marca</th><th>Modelo</th><th>Nº de carros</th></tr></thead>"
        "<tbody>"
        + "\n".join(linhas)
        + "</tbody></table>"
    )
    escreve_no_ficheiro(
        "output/marcas_modelos.html",
        pagina("Marcas e Modelos Intervencionados", mm_body, "index.html"),
    )

    # ------------------ Página de cada marca/modelo ------------------
    for mm in mm_ordenado:
        marca = mm["marca"]
        modelo = mm["modelo"]
        ficheiro_mm = mm_to_page[(marca, modelo)]
        nr_carros = len(mm["matriculas"])
        reps = mm["reparacoes"]

        lista_reps = ""
        for rep_id in reps:
            rep = rep_por_id.get(rep_id, {})
            lista_reps += (
                "<li>"
                f"<a href=\"{escape(rep_id)}.html\">{escape(fmt_reparacao_label(rep))}</a>"
                "</li>"
            )

        corpo = f"""
<table>
  <tr><th>Marca</th><td>{escape(marca)}</td></tr>
  <tr><th>Modelo</th><td>{escape(modelo)}</td></tr>
  <tr><th>Nº de carros</th><td>{escape(str(nr_carros))}</td></tr>
  <tr><th>Nº de reparações</th><td>{escape(str(len(reps)))}</td></tr>
</table>

<h3>Reparações</h3>
<ul>
  {lista_reps or '<li class="muted">(sem reparações)</li>'}
</ul>
""".strip()

        escreve_no_ficheiro(
            f"output/{ficheiro_mm}",
            pagina(f"{marca} — {modelo}", corpo, "marcas_modelos.html"),
        )


if __name__ == "__main__":
    main()
