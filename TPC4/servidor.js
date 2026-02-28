// treinos_server.js
// EW2026 : 2026-02-23
// by jcr

var http = require('http')
var axios = require('axios')

var templates = require('./template.js')           // Necessario criar e colocar na mesma pasta
var static = require('./static.js')                 // Colocar na mesma pasta
var { generateId, countBy, formDataToAtleta, collectRequestBodyData } = require('./myUtils.js')

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

                // GET /emd/stats ------------------------------------------------------
                else if (pathname == '/emd/stats') {
                    axios.get('http://localhost:3000/atletas')
                        .then(resp => {
                            var atletas = resp.data
                            var stats = {
                                sexo:       countBy(atletas, a => a['género']),
                                modalidade: countBy(atletas, a => a.modalidade),
                                clube:      countBy(atletas, a => a.clube),
                                resultado:  countBy(atletas, a => a.resultado ? 'Aprovado' : 'Reprovado'),
                                federado:   countBy(atletas, a => a.federado ? 'Federado' : 'Não federado')
                            }
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(templates.statsPage(stats, d))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter as estatísticas</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
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
                // GET /emd/apagar/:id ---------------------------------------------------------
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
                //GET /emd/stats ---------------------------------------------------------
                }else if(pathname == '/emd/stats') {
                    axios.get('http://localhost:3000/atletas')
                        .then(resp => {
                            var atletas = resp.data
                            var total = atletas.length
                            var aprovados = atletas.filter(a => a.resultado).length
                            var reprovados = total - aprovados
                            var stats = { total, aprovados, reprovados }
                            res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
                            res.write(JSON.stringify(stats))
                            res.end()
                        })
                        .catch(erro => {
                            res.writeHead(501, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Não foi possível obter as estatísticas</p>')
                            res.write('<p>' + erro + '</p>')
                            res.end()
                        })
                }

                else {
                    res.writeHead(404, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write('<p>Recurso não encontrado: ' + req.url + '</p>')
                    res.end()
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



