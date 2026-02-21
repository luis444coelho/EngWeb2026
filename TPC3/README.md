## EngWeb2026

- **Título**: TPC3
- **Data**: 21/02/2026
- **Autor**: Luís Miguel Silva Coelho
- **UC**: Engenharia Web

## Autor
- A106843
- Luís Miguel Silva Coelho
- ![foto](foto.jpeg)

## Resumo

Este trabalho consiste na criação de uma aplicação web para consulta de dados de uma escola de música.

Foi utilizado o dataset `db.json`. A solução foi dividida em 3 componentes:

1. **Servidor de dados (`json-server`)**
	- Disponibiliza os dados do ficheiro `db.json` na porta `3000`.

2. **Servidor API (`escola_musica_api.js`)**
	- Corre na porta `25000`.
	- Consome o `json-server` e expõe endpoints REST para a aplicação:
	  - `GET /alunos`
	  - `GET /cursos`
	  - `GET /instrumentos`

3. **Servidor aplicacional (`escola_musica_app.js`)**
	- Corre na porta `25001`.
	- Consome a API (`25000`) e gera páginas HTML dinâmicas com W3.CSS.

Foram implementados os serviços pedidos no enunciado:
- `/alunos` — tabela HTML com os dados de todos os alunos;
- `/cursos` — tabela HTML com a informação de todos os cursos;
- `/instrumentos` — tabela HTML com os dados dos vários instrumentos.

Foi também implementada uma **página principal** (`/`) com links para as três listagens.

## Lista de Resultados
- `db.json` — dataset da escola de música
- `escola_musica_api.js` — servidor API (porta 25000)
- `escola_musica_app.js` — servidor aplicacional HTML (porta 25001)
- `myUtil.js` — funções auxiliares de HTML e acesso à API
- `package.json` — dependências do projeto

