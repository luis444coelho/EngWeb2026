## EngWeb2026

- **Título**: TPC2
- **Data**: 14/02/2026
- **Autor**: Luís Miguel Silva Coelho
- **UC**: Engenharia Web

## Autor
- A106843
- Luís Miguel Silva Coelho
- ![foto](foto.jpeg)

## Resumo

Este trabalho consiste na criação de uma aplicação web para consulta de dados de uma oficina automóvel, baseada no dataset `dataset_reparacoes.json`.

Foi criado um servidor aplicacional em Node.js (`servidor_oficina.js`) que consome um json-server com o dataset das reparações e responde a pedidos HTTP, gerando páginas HTML dinâmicas para consulta dos dados.

O servidor responde aos seguintes serviços:
- `/reparacoes`: Tabela HTML com os dados das reparações.
- `/intervencoes`: Tabela HTML com os diferentes tipos de intervenção, sem repetições e com os dados de cada intervenção.
- `/viaturas`: Tabela HTML com os dados dos tipos de viatura intervencionados e o número de vezes que cada modelo foi reparado.

Cada endpoint processa os dados do dataset e devolve uma página HTML.

## Lista de Resultados
- `dataset_reparacoes.json` — dataset fornecido
- `servidor_oficina.js` — servidor Node.js com os endpoints implementados

