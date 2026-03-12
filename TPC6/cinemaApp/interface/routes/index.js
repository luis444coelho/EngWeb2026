var express = require('express');
var router = express.Router();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:7779';

// Redireciona / para /filmes
router.get('/', (req, res) => res.redirect('/filmes'));

// GET /filmes - tabela com id, título, ano, nº atores, nº géneros
router.get('/filmes', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/filmes`)
        .then(response => {
            res.render('filmes', { filmes: response.data, date: d });
        })
        .catch(err => {
            res.render('error', { error: err, message: 'Erro ao obter filmes da API' });
        });
});

// GET /filmes/:id - página individual do filme
router.get('/filmes/:id', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/filmes/${req.params.id}`)
        .then(response => {
            res.render('filme', { filme: response.data, date: d });
        })
        .catch(err => {
            res.render('error', { error: err, message: 'Erro ao obter filme da API' });
        });
});

module.exports = router;