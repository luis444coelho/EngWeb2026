import json
import random

with open("cinema.json", encoding="utf-8") as f:
    data = json.load(f)

lista = data["filmes"]

filme_ids = {}
ator_ids = {}
genero_ids = {}

def get_filme_id(nome):
    if nome not in filme_ids:
        filme_ids[nome] = random.randint(1, 100000)
    return filme_ids[nome]

def get_ator_id(nome):
    if nome not in ator_ids:
        ator_ids[nome] = random.randint(1, 100000)
    return ator_ids[nome]

def get_genero_id(nome):
    if nome not in genero_ids:
        genero_ids[nome] = random.randint(1, 100000)
    return genero_ids[nome]

# Coleção filmes: cast e genres passam a listas de objetos com id
filmes = [
    {
        "id": get_filme_id(a.get("title", str(i))),
        "titulo": a.get("title", ""),
        "ano": a.get("year", 0),
        "cast": [{"id": get_ator_id(nome), "nome": nome} for nome in a.get("cast", [])],
        "generos": [{"id": get_genero_id(g), "designacao": g} for g in a.get("genres", [])]
    }
    for i, a in enumerate(lista)
]

# Coleção atores: um documento por ator com lista de filmes em que participou
atores_map = {}
for filme in filmes:
    for ator in filme["cast"]:
        aid = ator["id"]
        if aid not in atores_map:
            atores_map[aid] = {"id": aid, "nome": ator["nome"], "filmes": []}
        atores_map[aid]["filmes"].append(filme["id"])

atores = list(atores_map.values())

# Coleção generos: um documento por género com lista de filmes associados
generos_map = {}
for filme in filmes:
    for genero in filme["generos"]:
        gid = genero["id"]
        if gid not in generos_map:
            generos_map[gid] = {"id": gid, "designacao": genero["designacao"], "filmes": []}
        generos_map[gid]["filmes"].append(filme["id"])

generos = list(generos_map.values())

with open("filmes.json", "w", encoding="utf-8") as f:
    json.dump(filmes, f, ensure_ascii=False, indent=2)

with open("atores.json", "w", encoding="utf-8") as f:
    json.dump(atores, f, ensure_ascii=False, indent=2)

with open("generos.json", "w", encoding="utf-8") as f:
    json.dump(generos, f, ensure_ascii=False, indent=2)

