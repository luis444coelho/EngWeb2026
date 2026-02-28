const pug = require('pug');

// Helper para compilar e renderizar
function renderPug(fileName, data) {
    return pug.renderFile(`./views/${fileName}.pug`, data);
}

exports.atletasListPage = (tlist, d) => renderPug('index', { list: tlist, date: d });
exports.atletasPage = (t) => renderPug('emd', { atleta: t});
exports.errorPage = (msg, d) => renderPug('error', { message: msg, date: d });
exports.atletasFormPage = (d) => renderPug('form', { date: d });
exports.atletasFormEditPage = (t, d) => renderPug('form', { atleta: t, date: d });
exports.statsPage = (stats, d) => renderPug('stats', { stats: stats, date: d });
