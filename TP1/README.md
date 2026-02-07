## Metainformação
- **Título**: TPC1
- **Data**: 07/02/2026
- **Autor**: Luís Miguel Silva Coelho
- **UC**: Engenharia Web

## Autor
- A106843
- Luís Miguel Silva Coelho
- ![foto](foto.jpeg)

## Resumo

Este trabalho consiste na análise e exploração do dataset `dataset_reparacoes.json`, que contém registos de reparações e intervenções realizadas numa oficina automóvel.

Foi desenvolvido um script em Python que lê o dataset e gera automaticamente um website estático, permitindo consultar listagens de reparações, intervenções, marcas/modelos e páginas de detalhe com a informação completa de cada entidade.

O website inclui uma navegação entre páginas, bem como ligações cruzadas entre todas as entidades.

## Lista de Resultados
- `dataset_reparacoes.json`- dataset fornecido
- `script.py` - script de criação do site
- `output/index.html` - página principal
- `output/reparacoes.html`- listagem das reparações
- `output/reparacao/` - páginas individuais de reparação, por NIF
- `output/intervencoes.html`- listagem dos tipos de intervenção
- `output/intervencao/` - páginas individuais de intervenção, com reparações associadas
- `output/marcas_modelos.html` - listagem de marcas/modelos
- `output/marca_modelo/` - páginas individuais de marca/modelo, com reparações associadas
