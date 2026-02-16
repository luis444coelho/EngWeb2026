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
                                <th>Nr Intervenções</th>
                                <th>Matricula</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                            </tr>
                        `
                dados = resp.data;
                dados.forEach(reparacao => {
                        html += `<tr>
                                    <td>${reparacao.nome}</td>
                                    <td>${reparacao.nif}</td>
                                    <td>${reparacao.data}</td>
                                    <td>${reparacao.nr_intervencoes}</td>
                                    <td>${reparacao.viatura.matricula}</td>
                                    <td>${reparacao.viatura.marca}</td>
                                    <td>${reparacao.viatura.modelo}</td>
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
                
                const intervencoesMap = new Map();

                for (const reparacao of resp.data) {
                    for (const intervencao of reparacao.intervencoes) {
                        if (intervencoesMap.has(intervencao.codigo)) {
                            intervencoesMap.get(intervencao.codigo).count++;
                        } else {
                            intervencoesMap.set(intervencao.codigo, {
                                nome: intervencao.nome,
                                descricao: intervencao.descricao,
                                count: 1
                            });
                        }
                    }
                }
                html = `<table border="1">
                    <tr>
                        <th>Código</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Nr Intervencoes</th>
                    </tr>

                `;
                const mapOrdenado = new Map([...intervencoesMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));
                for (const [codigo, info] of mapOrdenado) {
                    html += `<tr>
                        <td>${codigo}</td>
                        <td>${info.nome}</td>
                        <td>${info.descricao}</td>
                        <td>${info.count}</td>
                    </tr>`;
                }
                html += `</table>`;
                res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                res.end(html);
            }).catch(error => {
                res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
                res.end("<pre>" + JSON.stringify(error) + "</pre>")
            }); 
    }else if(req.url == "/viaturas"){
        axios.get('http://localhost:3000/reparacoes').then(resp => {

            const modelosMap = new Map();

            for (const reparacao of resp.data){
                modelo = reparacao.viatura.modelo;
                if (modelosMap.has(modelo)){
                    modelosMap.get(modelo).count++;
                }else{
                    modelosMap.set(modelo,{count : 1});
                }
            }

            html = `<table border="1">
                        <tr>
                            <th>Matricula</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Nr Reparações</th>
                        </tr>
                    `
            dados = resp.data;
            dados.forEach(reparacao => {
                html += `<tr>
                            <td>${reparacao.viatura.matricula}</td>
                            <td>${reparacao.viatura.marca}</td>
                            <td>${reparacao.viatura.modelo}</td>
                            <td>${modelosMap.get(reparacao.viatura.modelo).count}</td>
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
    }else{
        res.writeHead(520, {'Content-Type': 'text/html; charset=utf-8'})
        res.end("<p>Pedido não encontrado</p>")
    }
}).listen(7777)

console.log('Servidor a escutar na porta 7777')