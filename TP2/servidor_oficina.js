const http = require('http');
const axios = require('axios');

http.createServer(function (req, res) {
    if(req.url == "/reparacoes"){
        axios.get('http://localhost:3000/reparacoes').then(resp => {
                html = `<table border="1">
                            <tr>
                                <th>Nome</th>
                                <th>NIF</th>
                                <th>Data</th>
                            </tr>
                        `
                dados = resp.data;
                dados.forEach(a => {
                    html += `<tr>
                                <td>${a.nome}</td>
                                <td>${a.nif}</td>
                                <td>${a.data}</td>
                            </tr>`
                });
                html += `</table>`
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end(html)
        })
        .catch(error => {
            res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
            res.end("<pre>" + JSON.stringify(error) + "</pre>")
        });  
    }else if(req.url == "/intervencoes"){
            axios.get('http://localhost:3000/reparacoes').then(resp => {
                html = `<table border = "1">
                            <tr>
                            <th>Código</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Nr Intervencoes</th>
                            </tr>
                        `
                dados = resp.data;
                dados.forEach(reparacao => {
                    reparacao.intervencoes.forEach(intervencao => {
                        html += `<tr>
                                    <td>${intervencao.codigo}</td>
                                    <td>${intervencao.nome}</td>
                                    <td>${intervencao.descricao}</td>
                                    <td>${reparacao.nr_intervencoes}</td>
                                </tr>`
                    });
                });
                html += `</table>`
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
                res.end(html)
            }).catch(error => {
                res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
                res.end("<pre>" + JSON.stringify(error) + "</pre>")
            }); 
    }else{
        res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
        res.end("<p>Pedido não encontrado</p>")
    }
}).listen(7777)

console.log('Servidor a escutar na porta 7777')