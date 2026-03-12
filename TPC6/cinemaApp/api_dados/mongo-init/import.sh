#!/bin/bash
# Importa o JSON para a base de dados emd, coleção emd
mongoimport --host localhost --db emd --collection emd --type json --file /docker-entrypoint-initdb.d/emd.json --jsonArray

# Cria o índice de texto necessário para o parâmetro ?q= funcionar
mongosh emd --eval 'db.emd.createIndex({dataEMD: "text", modalidade: "text", nome.primeiro: "text", nome.último: "text", clube: "text", morada :"text"})'