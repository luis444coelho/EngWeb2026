const axios = require('axios')
const http = require('http')

http.createServer(async (req,res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    if (req.method === "GET") {
        if (req.url == "/alunos"){
            try{
                const resp = await axios.get('http://localhost:3000/alunos')
                let dados = resp.data
                const resultado = dados.map(a => ({
                    id: a.id,
                    nome: a.nome,
                    dataNasc: a.dataNasc,
                    curso: a.curso,
                    anoCurso : a.anoCurso,
                    instrumento: a.instrumento
                }) 
                )
                res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
                res.end(JSON.stringify(resultado))
            }catch(erro){
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
                res.end(`<p>Erro ao carregar alunos: ${erro}</p>`)
            }
        }else if (req.url == "/cursos"){
            try{
                const resp = await axios.get('http://localhost:3000/cursos')
                let dados = resp.data
                const resultado = dados.map(c => ({
                    id: c.id,
                    designacao: c.designacao,
                    duracao: c.duracao,
                    instrumento: c.instrumento["#text"]
                }))
                res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
                res.end(JSON.stringify(resultado))
            }catch(erro){
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
                res.end(`<p>Erro ao carregar cursos: ${erro}</p>`)
            }
        }else if (req.url == "/instrumentos"){
            try{
                const resp = await axios.get('http://localhost:3000/instrumentos')
                let dados = resp.data
                const resultado = dados.map(i => ({
                    id: i.id,
                    nome: i["#text"]
                }))
                res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
                res.end(JSON.stringify(resultado))
            }catch(erro){
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
                res.end(`<p>Erro ao carregar cursos: ${erro}</p>`)
            }
        }
    }
}).listen(25000)

console.log("Servidor à escuta na porta 25000...")