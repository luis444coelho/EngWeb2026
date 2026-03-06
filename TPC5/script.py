import json
import random

with open("cinema.json", encoding="utf-8") as f:
    data = json.load(f)

lista = data["filmes"]

filme_ids = {}
ator_ids = {}

def get_filme_id(nome):
    if nome not in filme_ids:
        filme_ids[nome] = random.randint(1, 100000)
    return filme_ids[nome]

def get_ator_id(nome):
    if nome not in ator_ids:
        ator_ids[nome] = random.randint(1, 100000)
    return ator_ids[nome]

lista = [
    {
        "id": get_filme_id(a.get("titulo", a.get("title", str(i)))),
        **{k: v for k, v in a.items() if k != "cast"},
        "cast": [{"id": get_ator_id(nome), "nome": nome} for nome in a.get("cast", [])]
    }
    for i, a in enumerate(lista)
]

res = {"filmes": lista}

with open("dataset.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)
