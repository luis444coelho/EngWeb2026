import json

with open("emd.json", encoding="utf-8") as f:
    lista = json.load(f)

res = {"atletas": lista}

with open("dataset.json", "w", encoding="utf-8") as f:
    json.dump(res, f, ensure_ascii=False, indent=2)
