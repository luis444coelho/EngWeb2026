const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.atletasListPage = (tlist, d) => renderPug('index', { list: tlist, date: d });
exports.atletasPage = (t) => renderPug('edm', { atleta: t});
exports.errorPage = (msg, d) => renderPug('error', { message: msg, date: d });