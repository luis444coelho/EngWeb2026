import json,os,shutil

def abrir_json(file):
    with open(file, encoding= "utf-8") as f :
        data = json.load(f)
    return data

def criar_pasta (path_relativo):
    if not os.path.exists(path_relativo) :
        os.mkdir(path_relativo)
    else:
        shutil.rmtree(path_relativo)
        os.mkdir(path_relativo)

def escreve_no_ficheiro (file, content):
    with open(file,"w", encoding = "utf-8") as f :
        f.write(content)


#---------------------------------------Script Principal-------------------------------------------------#

reparacoes = abrir_json("/home/luis/EW/EngWeb2026/TP1/dataset_reparacoes.json")

indice = f'''
<html>
    <head>
        <title>Reparações de Automóveis</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Reparações de Automóveis</h3>
        <ul>
            <li>
                <a href=\"reparacoes.html\">Listagem das reparações</a>
            </li>
            <li>
                <a href=\"intervencoes.html\">Listagem dos tipos de intervenção</a>
            </li>
            <li>
                <a href=\"marcas_modelos.html\">Listagem de marcas/modelos</a>
            </li>
        </ul>
    </body>
</html> 
'''


print(indice)
criar_pasta("output")
escreve_no_ficheiro("./output/index.html", indice)

#------------------- Listagem de reparações -------------------------------

lista_reparacoes_ordenada = reparacoes["reparacoes"]
lista_reparacoes_ordenada.sort(key=lambda r: r["data"])
lista_reparacoes = ""
for i, reparacao in enumerate(lista_reparacoes_ordenada):
    marca = reparacao.get("viatura", {}).get("marca", "")
    modelo = reparacao.get("viatura", {}).get("modelo", "")
    lista_reparacoes += f'''
            <tr>
                <td>{reparacao["data"]}</td>
                <td>{reparacao.get("nif", "")}</td>
                <td>{reparacao.get("nome", "")}</td>
                <td>{marca}</td>
                <td>{modelo}</td>
                <td>{reparacao["nr_intervencoes"]}</td>
                <td><a href="./reparacao/r{i}_{reparacao['data']}.html">Ver detalhes</a></td>
            </tr>
            '''
html_reparacoes = f'''
<html>
    <head>
        <title>Reparações de Automóveis</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Reparações de Automóveis</h3>
        <table border="1">
            <tr>
                <th>Data</th>
                <th>NIF</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Número de intervenções</th>
            </tr>
            {lista_reparacoes}
        </table>
        <p><a href="index.html">Voltar ao índice</a></p>
    </body>
</html>
'''
print(html_reparacoes)
escreve_no_ficheiro("./output/reparacoes.html", html_reparacoes)

#---------------------Página de uma reparação individual

reparacoes_info = reparacoes["reparacoes"]

criar_pasta("output/reparacao")

lista_reparacoes_info = ""
for i, reparacao in enumerate(reparacoes_info):
    marca = reparacao.get("viatura", {}).get("marca", "")
    modelo = reparacao.get("viatura", {}).get("modelo", "")
    intervencoes_info = ""
    for intervencao in reparacao.get("intervencoes", []):
        intervencoes_info += f'''
            <tr>
                <td>{intervencao["codigo"]}</td>
                <td>{intervencao["nome"]}</td>
                <td>{intervencao["descricao"]}</td>
            </tr>
            '''
    html_reparacao_info = f'''
<html>
    <head>
        <title>Reparação de {reparacao["nome"]}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Reparação de {reparacao["nome"]}</h3>
        <table border="1">
            <tr>
                <td>Data</td>
                <td>{reparacao["data"]}</td>
            </tr>
            <tr>
                <td>NIF</td>
                <td>{reparacao.get("nif", "")}</td>
            </tr>
            <tr>
                <td>Nome</td>
                <td>{reparacao.get("nome", "")}</td>
            </tr>
            <tr>
                <td>Marca</td>
                <td>{marca}</td>
            </tr>
            <tr>
                <td>Modelo</td>
                <td>{modelo}</td>
            </tr>
            <tr>
                <td>Número de intervenções</td>
                <td>{reparacao["nr_intervencoes"]}</td>
            </tr>
        </table>
        <h4>Intervenções</h4>
        <table border="1">
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Descrição</th>
            </tr>
            {intervencoes_info}
        </table>
        <p><a href="../reparacoes.html">Voltar à lista de reparações</a></p>
    </body>
</html>
    '''
    print(html_reparacao_info)
    escreve_no_ficheiro(f"./output/reparacao/r{i}_{reparacao['data']}.html", html_reparacao_info)