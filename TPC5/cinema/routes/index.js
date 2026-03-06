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


module.exports = router;
