import express from 'express';
import { getProducts, addProduct, editProduct, removeProduct, getProductById } from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', addProduct);
router.put('/:id', editProduct);
router.delete('/:id', removeProduct);
router.get('/:id', getProductById);

export default router;