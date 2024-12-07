const express = require('express');
const router = express.Router();

// Import controllers here
const clienteController = require('../controllers/clienteController');
const produtoController = require('../controllers/produtoController');
const servicoController = require('../controllers/servicoController');
const consumoController = require('../controllers/consumoController');

// Routes here
router.get('/clientes', clienteController.getAllClientes);
router.get('/clientes/:id', clienteController.getClienteById);
router.post('/clientes', clienteController.createCliente);
router.put('/clientes/:id', clienteController.updateCliente);
router.delete('/clientes/:id', clienteController.deleteCliente);

router.get('/produtos', produtoController.getAllProdutos);
router.get('/produtos/:id', produtoController.getProdutoById);
router.post('/produtos', produtoController.createProduto);
router.put('/produtos/:id', produtoController.updateProduto);
router.delete('/produtos/:id', produtoController.deleteProduto);

router.get('/servicos', servicoController.getAllServicos);
router.get('/servicos/:id', servicoController.getServicoById);
router.post('/servicos', servicoController.createServico);
router.put('/servicos/:id', servicoController.updateServico);
router.delete('/servicos/:id', servicoController.deleteServico);

router.post("/consumos", consumoController.createConsumo);
router.get("/consumos", consumoController.getAllConsumos);
router.get("/consumos/top10Clientes", consumoController.top10ClientesPorConsumo);
router.get("/consumos/top5ProdutosServicos", consumoController.top5ProdutosServicos);
router.get("/consumos/top5ProdutosServicosPorGenero", consumoController.top5ProdutosServicosPorGenero);
router.get("/consumos/menos10Clientes", consumoController.menos10ClientesPorConsumo);
router.get("/consumos/top5ClientesPorValor", consumoController.top5ClientesPorValor);

module.exports = router;