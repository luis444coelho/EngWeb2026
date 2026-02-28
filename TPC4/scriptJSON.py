import json

with open("emd.json", encoding="utf-8") as f:
    lista = json.load(f)

lista = [{"id": a.pop("_id"), **a} if "_id" in a else a for a in lista]

res = {"atletas": lista}

with open("dataset.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)
