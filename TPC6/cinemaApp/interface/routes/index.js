var express = require('express');
var router = express.Router();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:7779';

// Redireciona / para /filmes
router.get('/', (req, res) => res.redirect('/filmes'));

// GET /filmes 
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

// GET /atores
router.get('/atores', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/atores`)
        .then(response => {
            res.render('atores', { atores: response.data, date: d });
        })
        .catch(err => {
            res.render('error', { error: err, message: 'Erro ao obter atores da API' });
        });
});

// GET /atores/:id - página individual do ator
router.get('/atores/:id', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/atores/${req.params.id}`)
        .then(response => {
            const ator = response.data;
            const filmIds = ator.filmes || [];
            return Promise.all(
                filmIds.map(fid =>
                    axios.get(`${API_URL}/filmes/${fid}`)
                        .then(r => ({ id: r.data.id, nome: r.data.titulo }))
                        .catch(() => ({ id: fid, nome: '(desconhecido)' }))
                )
            ).then(filmes => {
                ator.filmes = filmes;
                res.render('ator', { ator, date: d });
            });
        })
        .catch(err => {
            res.render('error', { error: err, message: 'Erro ao obter ator da API' });
        });
});

// GET /generos
router.get('/generos', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    axios.get(`${API_URL}/generos`)
        .then(response => {
            res.render('generos', { generos: response.data, date: d });
        })
        .catch(err => {
            res.render('error', { error: err, message: 'Erro ao obter géneros da API' });
        });
});

module.exports = router;