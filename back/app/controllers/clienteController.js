const { PrismaClient } = require('@prisma/client');
const { parseISO, isValid } = require('date-fns');
const prisma = new PrismaClient();

const getAllClientes = async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany();
        res.json(clientes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getClienteById = async (req, res) => {
    try {
        const cliente = await prisma.cliente.findUnique({
            where: { id: parseInt(req.params.id) },
        });
        if (!cliente) return res.status(404).json({ error: 'Cliente não encontrado' });
        res.json(cliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const createCliente = async (req, res) => {
    try {
        const { nome, cpf, genero, dataEmissaoCPF, nomeSocial } = req.body;

        const dataEmissao = parseISO(dataEmissaoCPF);

        if (!isValid(dataEmissao)) {
            return res.status(400).json({ error: 'Formato de data inválido' });
        }

        const newCliente = await prisma.cliente.create({
            data: { nome, cpf, genero, dataEmissaoCPF: dataEmissao, nomeSocial },
        });
        res.status(201).json(newCliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const updateCliente = async (req, res) => {
    try {
        const { nome, cpf, genero, dataEmissaoCPF, nomeSocial } = req.body;

        const dataEmissao = parseISO(dataEmissaoCPF);

        if (!isValid(dataEmissao)) {
            return res.status(400).json({ error: 'Formato de data inválido' });
        }

        const updatedCliente = await prisma.cliente.update({
            where: { id: parseInt(req.params.id) },
            data: { nome, cpf, genero, dataEmissaoCPF: dataEmissao, nomeSocial },
        });
        res.json(updatedCliente);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const deleteCliente = async (req, res) => {
    try {
        await prisma.cliente.delete({
            where: { id: parseInt(req.params.id) },
        });
        res.status(204).send();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
