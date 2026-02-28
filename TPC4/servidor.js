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
                // GET /atletas ------------------------------------------------------------------
                if((req.url == '/') || req.url == '/atletas'){
                    axios.get("http://localhost:3000/atletas?_sort=data")
                    .then(resp => {
                        var atletas = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.atletasListPage(atletas, d))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter a lista de alunos</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end()
                    })
                }
                // GET /atletas/:id --------------------------------------------------------------
                if(/\/atletas\/[a-fA-F0-9]+$/.test(req.url)){
                    var id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/atletas/" + id)
                    .then(resp => {
                        var atleta = resp.data
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.atletasPage(atleta))
                        res.end()
                    })
                    .catch(erro => {
                        res.writeHead(501, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write('<p>Não foi possível obter os detalhes do aluno</p>')
                        res.write('<p>' + erro + '</p>')
                        res.end()
                    })
                }
                // GET /atletas/register ---------------------------------------------------------

                
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



