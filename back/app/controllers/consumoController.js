const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createConsumo = async (req, res) => {
    try {
        const { clienteId, produtoId, servicoId, quantidade } = req.body;

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

        let quantInt = parseInt(quantidade)
        const newConsumo = await prisma.consumo.create({
            data: {
                clienteId,
                produtoId,
                servicoId,
                quantidade: quantInt,
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
			include: { cliente: true },
		});
	
		const clienteConsumos = consumos.reduce((acc, consumo) => {
			const id = consumo.clienteId;
			const qty = consumo.quantidade ?? 1;
			acc[id] = (acc[id] || 0) + qty;
			return acc;
		}, {});
	
		const topClientes = Object.entries(clienteConsumos)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([clienteId, totalQuantidade]) => ({
			clienteId: parseInt(clienteId, 10),
			consumoCount: totalQuantidade,
		}));
	
		const detailedClientes = await Promise.all(
			topClientes.map(async ({ clienteId, consumoCount }) => ({
				cliente: await prisma.cliente.findUnique({ where: { id: clienteId } }),
				consumoCount,
			}))
		);
	
      	res.json(detailedClientes);
    } catch (error) {
		console.error(error);
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
            const id = consumo.clienteId;
            const qty = consumo.quantidade ?? 1;
            acc[id] = (acc[id] || 0) + qty;
            return acc;
        }, {});

        const menosClientes = Object.entries(clienteConsumos)
            .sort(([, a], [, b]) => a - b)
            .slice(0, 10)
            .map(([clienteId, totalQuantidade]) => ({
                clienteId: parseInt(clienteId, 10),
                consumoCount: totalQuantidade,
            }));

        const detailedClientes = await Promise.all(
            menosClientes.map(async ({ clienteId, consumoCount }) => ({
                cliente: await prisma.cliente.findUnique({ where: { id: clienteId } }),
                consumoCount,
            }))
        );

        res.json(detailedClientes);
    } catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
    }
};

const top5ProdutosServicosPorGenero = async (req, res) => {
    try {
        const generos = await prisma.cliente.findMany({
            select: { genero: true, id: true },
        });

        const produtosPorGenero = {};
        const servicosPorGenero = {};

        for (const { genero, id: clienteId } of generos) {
            const consumos = await prisma.consumo.findMany({
                where: { clienteId },
                include: { produto: true, servico: true },
            });

            consumos.forEach(consumo => {
                const qty = consumo.quantidade || 1;

                if (consumo.produto) {
                    produtosPorGenero[genero] = produtosPorGenero[genero] || [];
                    produtosPorGenero[genero].push({
                        ...consumo.produto,
                        quantidade: qty,
                    });
                }

                if (consumo.servico) {
                    servicosPorGenero[genero] = servicosPorGenero[genero] || [];
                    servicosPorGenero[genero].push({
                        ...consumo.servico,
                        quantidade: qty,
                    });
                }
            });
        }

        const getTop5 = items => {
            const counts = items.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = { ...item, consumoCount: 0 };
                }
                acc[item.id].consumoCount += item.quantidade || 0;
                return acc;
            }, {});

            return Object.values(counts)
                .sort((a, b) => b.consumoCount - a.consumoCount)
                .slice(0, 5);
        };

        const formatted = Object.keys(produtosPorGenero).map(genero => ({
            genero,
            produtos: getTop5(produtosPorGenero[genero] || []),
            servicos: getTop5(servicosPorGenero[genero] || []),
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Erro no top5ProdutosServicosPorGenero:', error);
        res.status(500).json({ error: error.message });
    }
};


const top5ProdutosServicos = async (req, res) => {
    try {
        const produtos = await prisma.consumo.groupBy({
            by: ['produtoId'],
            _sum: { quantidade: true },
            where: { produtoId: { not: null } },
            orderBy: { _sum: { quantidade: 'desc' } },
            take: 5,
        });

        const servicos = await prisma.consumo.groupBy({
            by: ['servicoId'],
            _sum: { quantidade: true },
            where: { servicoId: { not: null } },
            orderBy: { _sum: { quantidade: 'desc' } },
            take: 5,
        });

        const detailedProdutos = await Promise.all(
            produtos.map(p => ({
                produto: prisma.produto.findUnique({ where: { id: p.produtoId } }),
                consumoCount: p._sum.quantidade ?? 0,
            }))
        ).then(items =>
            Promise.all(
                items.map(async ({ produto, consumoCount }) => ({
                    produto: await produto,
                    consumoCount,
                }))
            )
        );

        const detailedServicos = await Promise.all(
            servicos.map(s => ({
                servico: prisma.servico.findUnique({ where: { id: s.servicoId } }),
                consumoCount: s._sum.quantidade ?? 0,
            }))
        ).then(items =>
            Promise.all(
                items.map(async ({ servico, consumoCount }) => ({
                    servico: await servico,
                    consumoCount,
                }))
            )
        );

        res.json({ produtos: detailedProdutos, servicos: detailedServicos });
    } catch (error) {
        console.error('Erro no top5ProdutosServicos:', error);
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
        console.error(error)
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
