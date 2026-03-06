## EngWeb2026

- **Título**: TPC5
- **Data**: 06/03/2026
- **Autor**: Luís Miguel Silva Coelho
- **UC**: Engenharia Web

## Autor
- A106843
- Luís Miguel Silva Coelho
- ![foto](foto.jpeg)

## Resumo

Este trabalho consiste na criação de uma aplicação web para gestão de informação sobre filmes e atores, baseada no dataset `cinema.json`.

Foi utilizado o framework Express.js para criar um servidor aplicacional que consome um `json-server` com os dados dos filmes e responde a pedidos HTTP, gerando páginas HTML dinâmicas com templates em Pug e estilização W3.CSS.

O servidor responde aos seguintes serviços:

- `GET /` — página principal com tabela de todos os filmes (id, título, ano, atores, géneros);
- `GET /filmes/:id` — página de detalhe de um filme (id, título, ano, elenco completo, géneros);
- `GET /atores` — lista de todos os atores únicos ordenados alfabeticamente (id, nome);
- `GET /atores/:id` — página de detalhe de um ator (id, nome, número de filmes, lista de filmes onde apareceu).

## Lista de Resultados
- `cinema.json` — dataset original dos filmes
- `dataset.json` — dataset processado com IDs únicos
- `script.py` — script Python de processamento do dataset
- `cinema/` — aplicação Express.js
  - `app.js` — configuração da aplicação Express
  - `routes/index.js` — rotas da aplicação
  - `views/` — templates Pug (layout, index, filmes, ator, atores)
  - `public/stylesheets/` — ficheiro CSS (W3.CSS)

