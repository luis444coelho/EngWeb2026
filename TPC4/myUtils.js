const { parse } = require('querystring');

function generateId() {
    return Array.from({length: 24}, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function countBy(arr, keyFn) {
    return arr.reduce((acc, item) => {
        var key = keyFn(item)
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})
}

function formDataToAtleta(data, id, index) {
    var atleta = {}
    if (id !== undefined) atleta.id = id
    if (index !== undefined) atleta.index = index
    atleta.dataEMD = data.dataEMD
    atleta.nome = { primeiro: data.primeiro, 'último': data.ultimo }
    atleta.idade = parseInt(data.idade) || 0
    atleta['género'] = data.genero
    atleta.morada = data.morada || ''
    atleta.modalidade = data.modalidade
    atleta.clube = data.clube || ''
    atleta.email = data.email || ''
    atleta.federado = data.federado === 'true'
    atleta.resultado = data.resultado === 'true'
    return atleta
}

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

module.exports = { generateId, countBy, formDataToAtleta, collectRequestBodyData }
