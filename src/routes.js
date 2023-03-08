const { Router } = require("express");
const path = require('path');
const ProductController = require("./Controllers/ProductController");
const routes = Router();

routes.get("/", (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

routes.post("/task", ProductController.criar); // injeta o req e res automaticamente
routes.get("/task", ProductController.listar);
routes.post("/task/previsao", ProductController.buscarPorData);
routes.get("/task/:id", ProductController.buscarPorId);
routes.put("/task/:id", ProductController.atualizar);
routes.delete("/task/:id", ProductController.excluir);
module.exports = routes;