const http = require('http')
const {pagina, link, card, getCursos,getAlunos,getInstrumentos } = require('./myUtil')

http.createServer(async (req,res) => {
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    
    switch(req.method){
        case "GET":
        // --- Página principal
        if (req.url == "/"){
            try{
                    var corpo = card("Escola de Música", `
                        <ul class="w3-ul w3-hoverable">
                            <li>${link("/alunos", "Lista de Alunos")}</li>
                            <li>${link("/cursos", "Lista de Cursos")}</li>
                            <li>${link("/instrumentos", "Lista de Instrumentos")}</li>
                        </ul>
                        `)
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
                    res.end(pagina("Escola de Música", corpo))
            }catch(erro){
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
                res.end(`<p>Erro ao carregar página principal: ${erro}</p>`)
            }
        }else if (req.url == "/alunos"){
        try{
            const alunos = await getAlunos()
            var linhas = alunos.map(a => 
                `<tr>
                    <td>${a.nome}</td>
                    <td>${a.dataNasc}</td>
                    <td>${link("/cursos", a.curso)}</td>
                    <td>${a.anoCurso}</td>
                    <td>${link("/instrumentos", a.instrumento)}</td>
                </tr>`).join("")
            
            var corpo = card("Lista de Alunos", `
                <table class="w3-table w3-striped w3-bordered w3-hoverable">
                    <tr class="w3-light-grey">
                        <th>Nome</th>
                        <th>Data de Nascimento</th>
                        <th>Curso</th>
                        <th>Ano do Curso</th>
                        <th>Instrumento</th>
                    </tr>
                    ${linhas}
                </table>
                `
            )
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
            res.end(pagina("Lista de Alunos", corpo))
        }catch(erro){
            res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
            res.end(`<p>Erro ao carregar alunos: ${erro}</p>`)
        }
        }else if (req.url == "/cursos"){
            try{
                const cursos = await getCursos()
                var linhas = cursos.map(c => 
                    `<tr>
                        <td>${c.id}</td>
                        <td>${c.designacao}</td>
                        <td>${c.duracao} anos</td>
                        <td>${link("/instrumentos", c.instrumento)}</td>
                    </tr>`).join("")
                
                var corpo = card("Lista de Cursos", `
                    <table class="w3-table w3-striped w3-bordered w3-hoverable">
                        <tr class="w3-light-grey">
                            <th>ID</th>
                            <th>Designação</th>
                            <th>Duração</th>
                            <th>Instrumento</th>
                        </tr>
                        ${linhas}
                    </table>
                    `
                )
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
                res.end(pagina("Lista de Cursos", corpo))
            }catch(erro){
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
                res.end(`<p>Erro ao carregar cursos: ${erro}</p>`)
            }
        }else if (req.url == "/instrumentos"){
            try{
                const instrumentos = await getInstrumentos()
                var linhas = instrumentos.map(i => 
                    `<tr>
                        <td>${i.id}</td>
                        <td>${i.nome}</td>
                    </tr>`).join("")
                var corpo = card("Lista de Instrumentos", `
                    <table class="w3-table w3-striped w3-bordered w3-hoverable">
                        <tr class="w3-light-grey">
                            <th>ID</th>
                            <th>Nome</th>
                        </tr>
                        ${linhas}
                    </table>
                    `
                )
                res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
                res.end(pagina("Lista de Instrumentos", corpo))
            }catch(erro){
                res.writeHead(500, {"Content-Type": "text/html; charset=utf-8"})
                res.end(`<p>Erro ao carregar instrumentos: ${erro}</p>`)
            }
        }else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
                res.end(`<p>Rota não suportada: ${req.url}.</p>`)
            }
            break

        default:
            res.writeHead(405, { 'Content-Type': 'text/html; charset=utf-8' })
            res.end(`<p>Método não suportado: ${req.method}.</p>`)
    }
}).listen(25001)  

console.log("Servidor à escuta na porta 25001...")