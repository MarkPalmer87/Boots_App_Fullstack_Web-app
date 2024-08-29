import express from 'express';
import { getProducts, addProduct, editProduct, removeProduct, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Update the getProducts route to handle search parameter
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        console.log('Search query received:', search); // Add this log
        const products = await getProducts(req, res);
        console.log('Products returned:', products); // Add this log
        res.json(products);
    } catch (error) {
        console.error('Error in GET /products:', error); // Add this log
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

router.post('/', addProduct);
router.put('/:id', editProduct);
router.delete('/:id', removeProduct);
router.get('/:id', getProductById);

export default router;
