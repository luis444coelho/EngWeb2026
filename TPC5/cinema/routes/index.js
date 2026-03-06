var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/filmes")
        .then(resp => { 
            var filmes = resp.data
             res.render('index', { list: filmes, date: d });
        })
})

router.get('/filmes/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
    axios.get('http://localhost:3000/filmes/' + req.params.id)
                        .then(resp => { 
                            var filmes = resp.data
                            res.render('filmes', { filme: filmes, date: d });
                        })
})

router.get('/atores', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/filmes")
        .then(resp => { 
            var filmes = resp.data
            var atoresMap = {}
            filmes.forEach(filme => {
              filme.cast.forEach(ator => {
                atoresMap[ator.id] = ator
              })
            })
            var atores = Object.values(atoresMap).sort((a, b) => a.nome.localeCompare(b.nome))
            res.render('atores', { list: atores, date: d });
        })
})

router.get('/atores/:id', function(req, res, next) {
  var d = new Date().toISOString().substring(0, 16)
  axios.get("http://localhost:3000/filmes")
        .then(resp => { 
            var filmes = resp.data
            var atorId = parseInt(req.params.id)
            var filmesDoAtor = filmes.filter(filme => 
              filme.cast.some(ator => ator.id === atorId)
            )

            var ator = null
            if (filmesDoAtor.length > 0) {
              ator = filmesDoAtor[0].cast.find(a => a.id === atorId)
            }
            
            res.render('ator', { ator: ator, filmes: filmesDoAtor, date: d });
        })
})


module.exports = router;
