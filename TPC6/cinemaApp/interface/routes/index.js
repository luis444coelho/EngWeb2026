var express = require('express');
var router = express.Router();
const axios = require('axios');

// URL da API (Se estiveres a correr fora do Docker, usa localhost)
const API_URL = process.env.API_URL || "http://localhost:7789/emd";

router.get('/emds', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    
    // Faz o pedido à API de dados
    axios.get(API_URL)
        .then(response => {
            res.render('index', { 
                emds: response.data, 
                date: d 
            });
        })
        .catch(err => {
            res.render('error', { 
                error: err, 
                message: "Erro ao obter dados da API" 
            });
        });
});

router.get('/emds/stats', (req, res) => {
    const d = new Date().toISOString().substring(0, 16);
    
    // Faz o pedido à API de dados
    axios.get(API_URL)
        .then(response => {
            let emds = response.data;
            let stats = {
                modalidade: {}, clube: {}, genero: {}
            };

            emds.forEach(e => {
                // Distribuição por modalidade
                stats.modalidade[e.modalidade] = (stats.modalidade[e.modalidade] || 0) + 1;
                
                // Distribuição por clube
                stats.clube[e.clube] = (stats.clube[e.clube] || 0) + 1;
                
                // Distribuição por género/sexo
                stats.genero[e.género] = (stats.genero[e.género] || 0) + 1;
            });
            
            res.render('stats', { stats: stats, date: d})
        })
        .catch(err => {
            res.render('error', { 
                error: err, 
                message: "Erro ao obter dados da API" 
            });
        });
});

module.exports = router;