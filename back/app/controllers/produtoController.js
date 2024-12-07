const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllProdutos = async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany();
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProdutoById = async (req, res) => {
    try {
        const produto = await prisma.produto.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
        res.json(produto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduto = async (req, res) => {
    try {
        const { nome, preco } = req.body;
        const newProduto = await prisma.produto.create({
            data: { nome, preco },
        });
        res.status(201).json(newProduto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProduto = async (req, res) => {
    try {
        const { nome, preco } = req.body;
        const updatedProduto = await prisma.produto.update({
            where: { id: parseInt(req.params.id) },
            data: { nome, preco },
        });
        res.json(updatedProduto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduto = async (req, res) => {
    try {
        await prisma.produto.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllProdutos,
    getProdutoById,
    createProduto,
    updateProduto,
    deleteProduto
}