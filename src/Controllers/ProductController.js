const ProductModel = require("../Models/ProductModel");

function formatDate(date) {
    const day = ("0" + date.getDate()).slice(-2); // adiciona zero à esquerda do dia
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // adiciona zero à esquerda do mês (lembre-se que o getMonth() retorna de 0 a 11)
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
class ProductController {
    async criar(req, res) {
        const { titulo, concluida, previsao } = req.body;
        if(!titulo) {
            return res.status(400).json({mensagem: "Título requerido!"});
        }
        try {
            const criarProduto = await ProductModel.create(req.body);
            return res.status(200).json(criarProduto);
        } catch(err) {
            res.status(404).json({mensagem: "Nenhum resultado encontrado."});
        }
    }

    async listar(req, res) {
        const produtos = await ProductModel.find();
        return res.status(200).json(produtos);
    }

    async buscarPorId(req, res) {
        const { id } = req.params;
        try {
            const produto = await ProductModel.findById(id);
            return res.status(200).json(produto);
        } catch(err) {
            res.status(404).json({mensagem: "Não encontrado. Verifique o id passado como parâmetro."});
        }
    }

    async buscarPorData(req, res) {
        try {
            const produtos = await ProductModel.find(req.body);
            return res.status(200).json(produtos);
        } catch(err) {
            res.status(404).json({mensagem: "Não resultado encontrado."});
        }
    }

    async atualizar(req, res) {
        const { titulo } = req.body;
        if(!titulo) {
            return res.status(400).json({mensagem: "Título requerido!"});
        }
        const { id } = req.params;
        try {
            await ProductModel.findByIdAndUpdate(id, req.body);
            return  res.status(200).json({mensagem: "Atualização realizada com sucesso!"});
        } catch (err) {
            res.status(404).json({mensagem: "Erro ao atualizar. Verifique o id passado como parâmetro."});
        }
    }

    async excluir(req, res) {
        const { id } = req.params;
        try {  
            await ProductModel.findByIdAndDelete(id);
            return  res.status(200).json({mensagem: "Exclusão realizada com sucesso!"});
        } catch (err) {
            res.status(404).json({mensagem: "Erro ao excluir. Verifique o id passado como parâmetro."});
        }
    }
}

module.exports = new ProductController();