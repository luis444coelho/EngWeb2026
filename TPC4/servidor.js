// treinos_server.js
// EW2026 : 2026-02-23
// by jcr

var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./template.js')           // Necessario criar e colocar na mesma pasta
var static = require('./static.js')                 // Colocar na mesma pasta

// Aux functions
function generateId() {
    return Array.from({length: 24}, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function formDataToAtleta(data, id, index) {
    var atleta = {}
    if (id !== undefined) atleta.id = id
    if (index !== undefined) atleta.index = index
    atleta.dataEMD = data.dataEMD
    atleta.nome = { primeiro: data.primeiro, 'último': data.ultimo }
    atleta.idade = parseInt(data.idade) || 0
    atleta['género'] = data.genero
    atleta.morada = data.morada || ''
    atleta.modalidade = data.modalidade
    atleta.clube = data.clube || ''
    atleta.email = data.email || ''
    atleta.federado = data.federado === 'true'
    atleta.resultado = data.resultado === 'true'
    return atleta
}

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
                            try {
                                var html = templates.atletasListPage(resp.data, d)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(html)
                                res.end()
                            } catch(err) {
                                res.writeHead(500, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro ao gerar a lista: ' + err + '</p>')
                                res.end()
                            }
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

                // GET /emd/apagar/:id --------------------------------------------------
                else if (/\/emd\/apagar\/[a-zA-Z0-9]+$/.test(pathname)) {
                    var id = pathname.split('/')[3]

                    axios.delete('http://localhost:3000/atletas/' + id)
                        .then(() => {
                            res.writeHead(302, {'Location': '/emd'})
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível apagar o registo do atleta</p>')
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
                }else if (/\/emd\/apagar\/[a-zA-Z0-9]+$/.test(pathname)) {
                    var id = pathname.split('/')[3]
                    axios.delete('http://localhost:3000/atletas/' + id)
                        .then(() => {
                            res.writeHead(302, {'Location': '/emd'})
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível apagar o registo do atleta</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                }
                
                break;

            case "POST":
                var postUrl = new URL(req.url, 'http://localhost')
                var postPath = postUrl.pathname

                // POST /emd - inserir novo registo ------------------------------------------
                if (postPath == '/emd') {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            axios.get('http://localhost:3000/atletas')
                                .then(existing => {
                                    var index = existing.data.length
                                    var id = generateId()
                                    var atleta = formDataToAtleta(result, id, index)
                                    return axios.post('http://localhost:3000/atletas', atleta)
                                })
                                .then(() => {
                                    res.writeHead(302, {'Location': '/emd'})
                                    res.end()
                                })
                                .catch(erro => {
                                    res.writeHead(503, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p>Não foi possível inserir o registo</p>')
                                    res.write('<p>' + erro + '</p>')
                                    res.end()
                                })
                        } else {
                            res.writeHead(502, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body</p>')
                            res.end()
                        }
                    })
                }

                // POST /emd/:id - atualizar registo existente ----------------------------------
                else if (/\/emd\/[a-zA-Z0-9]+$/.test(postPath)) {
                    collectRequestBodyData(req, result => {
                        if (result) {
                            var id = postPath.split('/')[2]
                            axios.get('http://localhost:3000/atletas/' + id)
                            //Primeiro obtemos o registo existente para garantir que mantemos os campos não editados (como id)
                            //Depois fazemos um PUT com o objeto resultante da combinação do existente com os novos dados do form
                            //Isto é necessário porque o form não inclui todos os campos do registo (ex: id, email, etc) e não queremos perder esses dados
                                .then(existing => {
                                    var atleta = Object.assign({}, existing.data, formDataToAtleta(result))
                                    return axios.put('http://localhost:3000/atletas/' + id, atleta)
                                })
                                .then(() => {
                                    res.writeHead(302, {'Location': '/emd'})
                                    res.end()
                                })
                                .catch(erro => {
                                    res.writeHead(507, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p>Não foi possível atualizar o registo</p>')
                                    res.write('<p>' + erro + '</p>')
                                    res.end()
                                })
                        } else {
                            res.writeHead(506, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter os dados do body</p>')
                            res.end()
                        }
                    })
                }

                else {
                    res.writeHead(400, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>POST não suportado: ' + req.url + '</p>')
                    res.end()
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



