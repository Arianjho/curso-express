const express = require('express');
const { ProductService } = require('../services/product.service');
const { validatorHandler } = require('../middlewares/validator.handler');
const { createProductSchema, updateProductSchema, getProductSchema } = require('../dto/product.dto');

const router = express.Router();
const service = new ProductService();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Operations related to products
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/', async (req, res) => {
  const products = await service.find();

  res.json(products);
});

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a single product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 */
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

/**
* @swagger
* /api/v1/products:
*   post:
*     summary: Create a new product
*     description: Create a new product with the provided details
*     tags: [Products]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Name of the product
*               price:
*                 type: number
*                 description: Price of the product
*     responses:
*       201:
*         description: Product created successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: created
*                 data:
*                   type: object
*                   properties:
*                     id:
*                       type: string
*                       example: 12345
*                     name:
*                       type: string
*                       example: Sample Product
*                     price:
*                       type: number
*                       example: 99.99
*/
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

/**
* @swagger
* /api/v1/products/{id}:
*   put:
*     summary: Update a product by ID
*     description: Update details of a product by its ID
*     tags: [Products]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the product to update
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 description: Updated name of the product
*               price:
*                 type: number
*                 description: Updated price of the product
*     responses:
*       200:
*         description: Product updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: updated
*                 data:
*                   type: object
*                   properties:
*                     id:
*                       type: string
*                       example: 12345
*                     name:
*                       type: string
*                       example: Updated Product
*                     price:
*                       type: number
*                       example: 129.99
*/
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

/**
* @swagger
* /api/v1/products/{id}:
*   delete:
*     summary: Delete a product by ID
*     description: Delete a product by its ID
*     tags: [Products]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID of the product to delete
*         schema:
*           type: string
*     responses:
*       200:
*         description: Product deleted successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: deleted
*                 data:
*                   type: object
*                   properties:
*                     id:
*                       type: string
*                       example: 12345
*                     name:
*                       type: string
*                       example: Deleted Product
*                     price:
*                       type: number
*                       example: 129.99
*/
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const productDeleted = await service.delete(id);

  res.json({
    message: 'deleted',
    data: productDeleted
  });
});

module.exports = router;
