const express = require('express');
const { ProductService } = require('../services/product.service');
const { validatorHandler } = require('../middlewares/validator.handler');
const { createProductSchema, updateProductSchema, getProductSchema } = require('../dto/product.dto');

const router = express.Router();
const service = new ProductService();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Obtener todos los productos
 *     responses:
 *       200:
 *         description: Una lista de productos
 */
router.get('/', async (req, res) => {
  const products = await service.find();

  res.json(products);
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);

      res.json(product);
    } catch (error) {
      next(error);
    }
  });

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
    const body = req.body;
    const productCreated = await service.create(body);

    res.status(201).json({
      message: 'created',
      data: productCreated
    });
  });

router.put('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const productUpdated = await service.update(id, body);

      res.json({
        message: 'updated',
        data: productUpdated
      });
    } catch (error) {
      next(error);
    }
  });

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const productDeleted = await service.delete(id);

  res.json({
    message: 'deleted',
    data: productDeleted
  });
});

module.exports = router;
