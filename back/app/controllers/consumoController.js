const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createConsumo = async (req, res) => {
    try {
        const { clienteId, produtoId, servicoId } = req.body;

        if (!produtoId && !servicoId) {
            return res.status(400).json({ error: "Produto ou Serviço deve ser informado." });
        }

        let valorTotal = 0;

        if (produtoId) {
            const produto = await prisma.produto.findUnique({
                where: { id: produtoId },
            });
            if (!produto) {
                return res.status(404).json({ error: "Produto não encontrado." });
            }
            valorTotal = parseFloat(produto.preco);
        } else if (servicoId) {
            const servico = await prisma.servico.findUnique({
                where: { id: servicoId },
            });
            if (!servico) {
                return res.status(404).json({ error: "Serviço não encontrado." });
            }
            valorTotal = parseFloat(servico.preco);
        }

        const newConsumo = await prisma.consumo.create({
            data: {
                clienteId,
                produtoId,
                servicoId,
                valorTotal,
            },
        });

        res.status(201).json(newConsumo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getAllConsumos = async (req, res) => {
    try {
        const consumos = await prisma.consumo.findMany({
            include: {
                cliente: true,
                produto: true,
                servico: true,
            },
        });
        res.json(consumos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const top10ClientesPorConsumo = async (req, res) => {
    try {
        const consumos = await prisma.consumo.findMany({
            include: {
                cliente: true,
            },
        });

        const clienteConsumos = consumos.reduce((acc, consumo) => {
            const clienteId = consumo.clienteId;
            acc[clienteId] = (acc[clienteId] || 0) + 1;
            return acc;
        }, {});

        const topClientes = Object.entries(clienteConsumos)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([clienteId, count]) => ({
                clienteId: parseInt(clienteId, 10),
                count,
            }));

        const detailedClientes = await Promise.all(
            topClientes.map(async ({ clienteId, count }) => ({
                cliente: await prisma.cliente.findUnique({ where: { id: clienteId } }),
                consumoCount: count,
            }))
        );

        res.json(detailedClientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const menos10ClientesPorConsumo = async (req, res) => {
    try {
        const consumos = await prisma.consumo.findMany({
            include: {
                cliente: true,
            },
        });

        const clienteConsumos = consumos.reduce((acc, consumo) => {
            const clienteId = consumo.clienteId;
            acc[clienteId] = (acc[clienteId] || 0) + 1;
            return acc;
        }, {});

        const menosClientes = Object.entries(clienteConsumos)
            .sort(([, a], [, b]) => a - b) 
            .slice(0, 10)
            .map(([clienteId, count]) => ({
                clienteId: parseInt(clienteId, 10),
                count,
            }));

        const detailedClientes = await Promise.all(
            menosClientes.map(async ({ clienteId, count }) => ({
                cliente: await prisma.cliente.findUnique({ where: { id: clienteId } }),
                consumoCount: count,
            }))
        );

        res.json(detailedClientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const top5ProdutosServicosPorGenero = async (req, res) => {
    try {
        const generos = await prisma.cliente.findMany({
            select: {
                genero: true,
                id: true,
            },
        });

        const produtosPorGenero = {};
        const servicosPorGenero = {};

        for (const genero of generos) {
            const consumos = await prisma.consumo.findMany({
                where: { clienteId: genero.id },
                include: {
                    produto: true,
                    servico: true,
                },
            });

            consumos.forEach(consumo => {
                if (consumo.produto) {
                    if (!produtosPorGenero[genero.genero]) {
                        produtosPorGenero[genero.genero] = [];
                    }
                    produtosPorGenero[genero.genero].push(consumo.produto);
                }
                if (consumo.servico) {
                    if (!servicosPorGenero[genero.genero]) {
                        servicosPorGenero[genero.genero] = [];
                    }
                    servicosPorGenero[genero.genero].push(consumo.servico);
                }
            });
        }

        const getTop5 = (items) => {
            const itemCounts = items.reduce((acc, item) => {
                acc[item.id] = (acc[item.id] || 0) + 1;
                return acc;
            }, {});
            return Object.entries(itemCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([id]) => id);
        };

        const topProdutosPorGenero = {};
        const topServicosPorGenero = {};

        for (const genero of Object.keys(produtosPorGenero)) {
            topProdutosPorGenero[genero] = getTop5(produtosPorGenero[genero]);
            topServicosPorGenero[genero] = getTop5(servicosPorGenero[genero]);
        }

        res.json({ produtos: topProdutosPorGenero, servicos: topServicosPorGenero });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const top5ProdutosServicos = async (req, res) => {
    try {
        const produtos = await prisma.consumo.groupBy({
            by: ["produtoId"],
            _count: { produtoId: true },
            where: { produtoId: { not: null } },
            orderBy: { _count: { produtoId: "desc" } },
            take: 5,
        });

        const servicos = await prisma.consumo.groupBy({
            by: ["servicoId"],
            _count: { servicoId: true },
            where: { servicoId: { not: null } },
            orderBy: { _count: { servicoId: "desc" } },
            take: 5,
        });

        const detailedProdutos = await Promise.all(
            produtos.map(async (p) => ({
                produto: await prisma.produto.findUnique({ where: { id: p.produtoId } }),
                consumoCount: p._count.produtoId,
            }))
        );

        const detailedServicos = await Promise.all(
            servicos.map(async (s) => ({
                servico: await prisma.servico.findUnique({ where: { id: s.servicoId } }),
                consumoCount: s._count.servicoId,
            }))
        );

        res.json({ produtos: detailedProdutos, servicos: detailedServicos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const top5ClientesPorValor = async (req, res) => {
    try {
        const consumos = await prisma.consumo.groupBy({
            by: ["clienteId"],
            _sum: { valorTotal: true },
            orderBy: { _sum: { valorTotal: "desc" } },
            take: 5,
        });

        const detailedClientes = await Promise.all(
            consumos.map(async (c) => ({
                cliente: await prisma.cliente.findUnique({ where: { id: c.clienteId } }),
                valorTotal: c._sum.valorTotal,
            }))
        );

        res.json(detailedClientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createConsumo,
    getAllConsumos,
    top10ClientesPorConsumo,
    menos10ClientesPorConsumo, 
    top5ProdutosServicosPorGenero,
    top5ProdutosServicos,
    top5ClientesPorValor,
};
