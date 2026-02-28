// treinos_server.js
// EW2026 : 2026-02-23
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./template.js')           // Necessario criar e colocar na mesma pasta
var static = require('./static.js')                 // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation

var treinosServer = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET":
                var parsedUrl = new URL(req.url, 'http://localhost')
                var pathname = parsedUrl.pathname

                // GET / ou GET /emd ----------------------------------------------------
                if (pathname == '/' || pathname == '/emd') {
                    var sort = parsedUrl.searchParams.get('sort')
                    var apiUrl = sort == 'nome'
                        ? 'http://localhost:3000/atletas?_sort=nome.primeiro&_order=asc'
                        : 'http://localhost:3000/atletas?_sort=dataEMD&_order=desc'

                    axios.get(apiUrl)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.atletasListPage(resp.data, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter a lista de atletas</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                }

                // GET /emd/registo ----------------------------------------------------
                else if (pathname == '/emd/registo') {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write(templates.atletasFormPage(d))
                    res.end()
                }

                // GET /emd/editar/:id --------------------------------------------------
                else if (/\/emd\/editar\/[a-zA-Z0-9]+$/.test(pathname)) {
                    var id = pathname.split('/')[3]

                    axios.get('http://localhost:3000/atletas/' + id)
                        .then(resp => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.atletasFormEditPage(resp.data, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter o registo do atleta</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                }

                // GET /emd/:id ---------------------------------------------------------
                else if (/\/emd\/[a-zA-Z0-9]+$/.test(pathname)) {
                    var id = pathname.split('/')[2]

                    axios.get('http://localhost:3000/atletas/' + id)
                        .then(resp => {
                            try {
                                var html = templates.atletasPage(resp.data)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(html)
                                res.end()
                            } catch(err) {
                                res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro ao gerar a página do atleta: ' + err + '</p>')
                                res.end()
                            }
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter os detalhes do atleta</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                }
                
                break;
            default: 
                // Outros metodos nao sao suportados
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                res.write('<p>Método não suportado: ' + req.method + '</p>')
                res.end()
                break;
        }
    }
})

treinosServer.listen(7777, ()=>{
    console.log("Servidor à escuta na porta 7777...")
})



