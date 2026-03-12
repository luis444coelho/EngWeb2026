const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

app.use(function(req, res, next){
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)
    next()
})

const nomeBD = "cinema"
const mongoHost = process.env.MONGO_URL || `mongodb://127.0.0.1:27017/${nomeBD}`

// 2. Esquemas flexíveis para as 3 coleções
//    Os documentos usam o campo "id" (inteiro) como identificador (não _id do mongo)
const opts = { strict: false, versionKey: false }
const Filme  = mongoose.model('Filme',  new mongoose.Schema({}, { ...opts, collection: 'filmes'  }))
const Ator   = mongoose.model('Ator',   new mongoose.Schema({}, { ...opts, collection: 'atores'  }))
const Genero = mongoose.model('Genero', new mongoose.Schema({}, { ...opts, collection: 'generos' }))

mongoose.connect(mongoHost)
    .then(() => console.log(`MongoDB: ligado à base de dados ${nomeBD}.`))
    .catch(err => console.error('Erro MongoDB:', err))

// ── Fábrica de rotas CRUD genéricas ──────────────────────────────────────────
function addRoutes(router, path, Model) {

    // GET /path?campo=valor&_sort=campo&_order=asc|desc&_select=campo1,campo2
    router.get(path, async (req, res) => {
        try {
            let queryObj = { ...req.query }
            const sortField  = queryObj._sort
            const order      = queryObj._order === 'desc' ? -1 : 1
            const fields     = queryObj._select
            delete queryObj._sort; delete queryObj._order; delete queryObj._select

            let projection = {}
            if (fields) fields.split(',').forEach(f => { projection[f.trim()] = 1 })

            let q = Model.find(queryObj, projection)
            if (sortField) q = q.sort({ [sortField]: order })

            res.json(await q.exec())
        } catch (err) { res.status(500).json({ error: err.message }) }
    })

    // GET /path/:id  — pesquisa pelo campo "id" do documento
    router.get(path + '/:id', async (req, res) => {
        try {
            const doc = await Model.findOne({ id: Number(req.params.id) })
            if (!doc) return res.status(404).json({ error: "Não encontrado" })
            res.json(doc)
        } catch (err) { res.status(400).json({ error: err.message }) }
    })

    // POST /path
    router.post(path, async (req, res) => {
        try {
            const saved = await new Model(req.body).save()
            res.status(201).json(saved)
        } catch (err) { res.status(400).json({ error: err.message }) }
    })

    // PUT /path/:id
    router.put(path + '/:id', async (req, res) => {
        try {
            const updated = await Model.findOneAndUpdate(
                { id: Number(req.params.id) }, req.body, { new: true }
            )
            if (!updated) return res.status(404).json({ error: "Não encontrado" })
            res.json(updated)
        } catch (err) { res.status(400).json({ error: err.message }) }
    })

    // DELETE /path/:id
    router.delete(path + '/:id', async (req, res) => {
        try {
            const deleted = await Model.findOneAndDelete({ id: Number(req.params.id) })
            if (!deleted) return res.status(404).json({ error: "Não encontrado" })
            res.json({ message: "Eliminado com sucesso", id: req.params.id })
        } catch (err) { res.status(500).json({ error: err.message }) }
    })
}

// 3. Registar rotas para as 3 coleções
addRoutes(app, '/filmes',  Filme)
addRoutes(app, '/atores',  Ator)
addRoutes(app, '/generos', Genero)

app.listen(7779, () => {
    console.log('API cinema em http://localhost:7779')
    console.log('  GET /filmes   GET /filmes/:id')
    console.log('  GET /atores   GET /atores/:id')
    console.log('  GET /generos  GET /generos/:id')
})