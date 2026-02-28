## EngWeb2026

- **Título**: TPC4
- **Data**: 28/02/2026
- **Autor**: Luís Miguel Silva Coelho
- **UC**: Engenharia Web

## Autor
- A106843
- Luís Miguel Silva Coelho
- ![foto](foto.jpeg)

## Resumo

Este trabalho consiste na criação de uma aplicação web para gestão de Exames Médico-Desportivos (EMD), baseada no dataset `dataset.json`.

Foi criado um servidor aplicacional em Node.js (`servidor.js`) que consome um `json-server` com os dados dos atletas e responde a pedidos HTTP, gerando páginas HTML dinâmicas com templates em Pug.

O servidor responde aos seguintes serviços:

- `GET /` ou `GET /emd` — lista de todos os atletas, ordenável por data de EMD (desc) ou nome (asc);
- `GET /emd/registo` — formulário de inserção de um novo registo;
- `GET /emd/stats` — página de estatísticas com distribuição dos registos por sexo, modalidade, clube, resultado e federado;
- `GET /emd/editar/:id` — formulário de edição de um registo existente;
- `GET /emd/apagar/:id` — apaga o registo selecionado e redireciona para a página principal;
- `GET /emd/:id` — página de detalhe de um atleta;
- `POST /emd` — insere um novo registo na base de dados e redireciona para a página principal;
- `POST /emd/:id` — atualiza um registo existente e redireciona para a página principal.

## Lista de Resultados
- `dataset.json` — dataset dos atletas 
- `servidor.js` — servidor aplicacional Node.js 
- `template.js` — funções de renderização das views Pug
- `myUtils.js` — funções auxiliares (geração de ID, parsing do formulário, etc.)
- `static.js` — serviço de ficheiros estáticos
- `views/` — templates Pug (index, emd, form, stats, layout)
- `public/` — ficheiros estáticos (CSS, imagens)
- `scriptJSON.py` — script Python auxiliar de processamento do dataset
