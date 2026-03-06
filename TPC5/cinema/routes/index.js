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
            // Extract all unique actors
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



module.exports = router;
