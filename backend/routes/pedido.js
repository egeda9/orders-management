const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const pedidoController = require('../controllers/pedido_controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/pedido/ListaSelAll - Get all orders with pagination and filtering
router.get('/ListaSelAll', pedidoController.listaSelAll);

// GET /api/pedido/Get - Get single order by ID
router.get('/Get', pedidoController.get);

// POST /api/pedido/Post - Create new order
router.post('/Post', pedidoController.post);

// PUT /api/pedido/Put - Update order
router.put('/Put', pedidoController.put);

// DELETE /api/pedido/Delete - Delete order (optional)
router.delete('/Delete', pedidoController.delete);

module.exports = router;