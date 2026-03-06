import json
import random

with open("cinema.json", encoding="utf-8") as f:
    data = json.load(f)

lista = data["filmes"]

lista = [{"id": random.randint(1, 100000), **a} for a in lista]

res = {"filmes": lista}

with open("dataset.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)