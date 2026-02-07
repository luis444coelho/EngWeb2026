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

reparacoes = abrir_json("dataset_reparacoes.json")

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
for reparacao in lista_reparacoes_ordenada:
    marca = reparacao["viatura"]["marca"]
    modelo = reparacao["viatura"]["modelo"]
    nif = str(reparacao["nif"])
    lista_reparacoes += f'''
            <tr>
                <td>{reparacao["data"]}</td>
                <td>{reparacao["nif"]}</td>
                <td>{reparacao["nome"]}</td>
                <td>{marca}</td>
                <td>{modelo}</td>
                <td>{reparacao["nr_intervencoes"]}</td>
                <td><a href="./reparacao/{nif}.html">Ver detalhes</a></td>
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
                <th>Detalhes</th>
            </tr>
            {lista_reparacoes}
        </table>
        <p><a href="index.html">Voltar ao índice</a></p>
    </body>
</html>
'''
#print(html_reparacoes)
escreve_no_ficheiro("./output/reparacoes.html", html_reparacoes)

#---------------------Página de uma reparação individual ------------------------------

reparacoes_info = reparacoes["reparacoes"]

criar_pasta("output/reparacao")

lista_reparacoes_info = ""
for reparacao in reparacoes_info:
    marca = reparacao["viatura"]["marca"]
    modelo = reparacao["viatura"]["modelo"]
    nif = str(reparacao["nif"])
    intervencoes_info = ""
    for intervencao in reparacao["intervencoes"]:
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
                <td>{reparacao["nif"]}</td>
            </tr>
            <tr>
                <td>Nome</td>
                <td>{reparacao["nome"]}</td>
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
    #print(html_reparacao_info)
    escreve_no_ficheiro(f"./output/reparacao/{nif}.html", html_reparacao_info)

#------------------- Listagem dos tipos de intervenção -------------------------------

intervencoes_por_codigo = {}
for reparacao in reparacoes["reparacoes"]:
    for intervencao in reparacao["intervencoes"]:
        codigo = intervencao["codigo"]
        if codigo not in intervencoes_por_codigo:
            intervencoes_por_codigo[codigo] = intervencao

intervencoes_ordenadas = sorted(intervencoes_por_codigo.values(), key=lambda i: i["codigo"])
lista_intervencoes = ""

for intervencao in intervencoes_ordenadas:
    lista_intervencoes += f'''
            <tr>
                <td>{intervencao["codigo"]}</td>
                <td>{intervencao["nome"]}</td>
                <td>{intervencao["descricao"]}</td>
                <td> <a href="./intervencao/{intervencao['codigo']}.html">Ver detalhes</a></td>
            </tr>
            '''
html_intervencoes = f'''
<html>
    <head>
        <title>Tipos de Intervenção</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Tipos de Intervenção</h3>
        <table border="1">
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Detalhes</th>
            </tr>
            {lista_intervencoes}
        </table>
        <p><a href="index.html">Voltar ao índice</a></p>
    </body>
</html>
'''
#print(html_intervencoes)
escreve_no_ficheiro("./output/intervencoes.html", html_intervencoes)

#------------------- Página de um tipo de intervenção -------------------------------

reparacoes_info = reparacoes["reparacoes"]

criar_pasta("output/intervencao")
#Reparações que incluem esta intervenção
for intervencao in intervencoes_ordenadas:
    reparacoes_com_intervencao = []
    for reparacao in reparacoes_info:
        intervencoes_na_reparacao = list(filter(lambda i: i["codigo"] == intervencao["codigo"], reparacao.get("intervencoes", [])))
        if intervencoes_na_reparacao:
            reparacoes_com_intervencao.append(reparacao)
#Links para as reparações que incluem esta intervenção
    links_reparacoes = ""
    for reparacao in reparacoes_com_intervencao:
        marca = reparacao.get("viatura", {}).get("marca", "")
        modelo = reparacao.get("viatura", {}).get("modelo", "")
        nif = str(reparacao["nif"])
        links_reparacoes += f'''
            <li>
                <a href="../reparacao/{nif}.html">{reparacao["nome"]} - {marca} {modelo}</a>
            </li>
            '''

    html_intervencao = f'''
<html>
    <head>
        <title>Intervenção {intervencao['codigo']}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Intervenção {intervencao['codigo']}</h3>
        <table border="1">
            <tr>
                <td>Código</td>
                <td>{intervencao['codigo']}</td>
            </tr>
            <tr>
                <td>Nome</td>
                <td>{intervencao['nome']}</td>
            </tr>
            <tr>
                <td>Descrição</td>
                <td>{intervencao['descricao']}</td>
            </tr>
        </table>
        <h4>Reparações que incluem esta intervenção</h4>
        <ul>
            {links_reparacoes}
        </ul>
        <p><a href="../intervencoes.html">Voltar à lista de intervenções</a></p>
        <p><a href="../index.html">Voltar ao índice</a></p>
    </body>
</html>
'''
    escreve_no_ficheiro(f"./output/intervencao/{intervencao['codigo']}.html", html_intervencao)

#------------------- Listagem das marcas e modelos dos carros intervencionados -------------------------------

contagem = {}
reparacoes_por_marca_modelo = {}

#Contar o número de reparações por marca e modelo e organizar as reparações por marca e modelo
for reparacao in reparacoes["reparacoes"]:
    marca = reparacao["viatura"]["marca"]
    modelo = reparacao["viatura"]["modelo"]
    chave = (marca, modelo)
    if chave not in contagem:
        contagem[chave] = 0
    contagem[chave] += 1
    if chave not in reparacoes_por_marca_modelo:
        reparacoes_por_marca_modelo[chave] = []
    reparacoes_por_marca_modelo[chave].append(reparacao)

lista_marcas_modelos = ""

lista_ordenada_alfabeticamente = sorted(
    contagem.items(),
    key=lambda item: (item[0][0].lower(), item[0][1].lower())
)

for (marca, modelo), quantidade in lista_ordenada_alfabeticamente:
    nome_ficheiro = f"{marca}_{modelo}".replace(" ", "_").replace("/", "_").replace("\\", "_")
    lista_marcas_modelos += f'''
            <tr>
                <td>{marca}</td>
                <td>{modelo}</td>
                <td>{quantidade}</td>
                <td><a href="./marca_modelo/{nome_ficheiro}.html">Ver detalhes</a></td>
            </tr>
            '''

html_marcas_modelos = f'''
<html>
    <head>
        <title>Marcas e Modelos</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>Marcas e Modelos dos Carros Intervencionados</h3>
        <table border="1">
            <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Quantidade de Reparações</th>
                <th>Detalhes</th>
            </tr>
            {lista_marcas_modelos}
        </table>
        <p><a href="index.html">Voltar ao índice</a></p>
    </body>
</html>
'''
#print(html_marcas_modelos)
escreve_no_ficheiro("./output/marcas_modelos.html", html_marcas_modelos)

#------------------- Página de uma marca/modelo -------------------------------

criar_pasta("output/marca_modelo")

for (marca, modelo), quantidade in lista_ordenada_alfabeticamente:
    nome_ficheiro = f"{marca}_{modelo}".replace(" ", "_").replace("/", "_").replace("\\", "_")
    lista_reps = ""

    for reparacao in reparacoes_por_marca_modelo.get((marca, modelo), []):
        lista_reps += f'''
            <tr>
                <td>{reparacao["data"]}</td>
                <td>{reparacao["nif"]}</td>
                <td>{reparacao["nome"]}</td>
                <td>{reparacao["nr_intervencoes"]}</td>
                <td><a href="../reparacao/{reparacao["nif"]}.html">Ver detalhes</a></td>
            </tr>
        '''

    html_marca_modelo = f'''
<html>
    <head>
        <title>{marca} {modelo}</title>
        <meta charset="utf-8"/>
    </head>
    <body>
        <h3>{marca} {modelo}</h3>
        <table border="1">
            <tr>
                <td>Marca</td>
                <td>{marca}</td>
            </tr>
            <tr>
                <td>Modelo</td>
                <td>{modelo}</td>
            </tr>
            <tr>
                <td>Número de carros intervencionados</td>
                <td>{quantidade}</td>
            </tr>
        </table>

        <h4>Reparações deste marca/modelo</h4>
        <table border="1">
            <tr>
                <th>Data</th>
                <th>NIF</th>
                <th>Nome</th>
                <th>Nº intervenções</th>
                <th>Detalhes</th>
            </tr>
            {lista_reps}
        </table>

        <p><a href="../marcas_modelos.html">Voltar à lista de marcas/modelos</a></p>
        <p><a href="../index.html">Voltar ao índice</a></p>
    </body>
</html>
'''
    escreve_no_ficheiro(f"./output/marca_modelo/{nome_ficheiro}.html", html_marca_modelo)
