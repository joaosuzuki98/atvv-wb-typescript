const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllServicos = async (req, res) => {
    try {
        const servicos = await prisma.servico.findMany();
        res.json(servicos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getServicoById = async (req, res) => {
    try {
        const servico = await prisma.servico.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!servico) return res.status(404).json({ error: 'Serviço não encontrado' });
        res.json(servico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createServico = async (req, res) => {
    try {
        const { nome, preco } = req.body;
        const newServico = await prisma.servico.create({
            data: { nome, preco },
        });
        res.status(201).json(newServico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateServico = async (req, res) => {
    try {
        const { nome, preco } = req.body;
        const updatedServico = await prisma.servico.update({
            where: { id: parseInt(req.params.id) },
            data: { nome, preco },
        });
        res.json(updatedServico);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteServico = async (req, res) => {
    try {
        await prisma.servico.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllServicos,
    getServicoById,
    createServico,
    updateServico,
    deleteServico
}