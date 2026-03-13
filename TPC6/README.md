## EngWeb2026

- **Título**: TPC6
- **Data**: 13/03/2026
- **Autor**: Luís Miguel Silva Coelho
- **UC**: Engenharia Web

## Autor
- A106843
- Luís Miguel Silva Coelho
- ![foto](foto.jpeg)

## Resumo

Este trabalho consiste na criação de uma aplicação web de gestão de informação sobre filmes, atores e géneros cinematográficos, baseada no dataset `cinema.json`, com uma arquitetura de microserviços orquestrada com Docker Compose.

A aplicação é composta por três serviços:

- **MongoDB** — base de dados com três coleções: `filmes`, `atores` e `generos`;
- **api_dados** — API REST em Express.js + Mongoose que expõe endpoints CRUD para as três coleções;
- **interface** — servidor aplicacional em Express.js que consome a API e gera páginas HTML dinâmicas com templates em Pug.

A interface responde aos seguintes serviços:

- `GET /` — redireciona para `/filmes`;
- `GET /filmes` — lista de todos os filmes;
- `GET /filmes/:id` — página de detalhe de um filme (título, ano, elenco, géneros);
- `GET /atores` — lista de todos os atores;
- `GET /atores/:id` — página de detalhe de um ator (nome, filmes em que participou);
- `GET /generos` — lista de todos os géneros cinematográficos.

A API de dados (`api_dados`) expõe endpoints CRUD genéricos para cada coleção.

## Lista de Resultados
- `cinemaApp/` — aplicação completa
  - `docker-compose.yml` — orquestração dos três serviços (MongoDB, api_dados, interface)
  - `api_dados/` — serviço de API REST
    - `myServer_sel_proj.js` — servidor Express.js com rotas CRUD genéricas via Mongoose
    - `cinema.json`, `filmes.json`, `atores.json`, `generos.json` — datasets
    - `script.py` — script Python de processamento do dataset
    - `Dockerfile`, `Dockerfile.mongo` — imagens Docker da API e do MongoDB
    - `mongo-init/` — scripts de inicialização da base de dados
  - `interface/` — serviço de interface web
    - `app.js` — configuração da aplicação Express
    - `routes/index.js` — rotas da interface
    - `views/` — templates Pug (layout, filmes, filme, atores, ator, generos, error)
    - `public/` — ficheiros estáticos (CSS, imagens)
    - `Dockerfile.interface` — imagem Docker da interface
