import express from 'express';
import { getProducts, addProduct, editProduct, removeProduct, getProductById } from '../controllers/productController.js';

const router = express.Router();

// Update the getProducts route to handle search parameter and filters
router.get('/', async (req, res) => {
    try {
        const { search, name, brand, color, price, sizes } = req.query; 
        const sizesSubQuery = "SELECT GROUP_CONCAT(size, ' ') FROM boot_sizes WHERE boot_id = leather_boots.id group by boot_id";
        let query = `SELECT id, name, brand, color, price, (${sizesSubQuery}) AS sizes FROM leather_boots WHERE 1=1`;
        const params = [];

        if (search) {
            const searchConditions = [];
            if (name === 'true') searchConditions.push('name LIKE ?');
            if (brand === 'true') searchConditions.push('brand LIKE ?');
            if (color === 'true') searchConditions.push('color LIKE ?');
            if (price === 'true') searchConditions.push('price LIKE ?');
            if (sizes === 'true') searchConditions.push(`(${sizesSubQuery}) LIKE ?`);

            if (searchConditions.length > 0) {
                query += ` AND (${searchConditions.join(' OR ')})`;
                params.push(...Array(searchConditions.length).fill(`%${search}%`));
            } else {
                query += ` AND (name LIKE ? OR brand LIKE ? OR color LIKE ? OR price LIKE ? OR (${sizesSubQuery}) LIKE ?)`;
                params.push(...Array(5).fill(`%${search}%`));
            }
        }

        console.log('Executing query:', query);
        console.log('With parameters:', params);

        const [boots] = await req.pool.query(query, params);
        res.json(boots);
    } catch (error) {
        console.error('Error in GET /products:', error);
        res.status(500).json({ message: 'Error fetching leather boots', error: error.message });
    }
});

router.post('/', addProduct);
router.put('/:id', editProduct);
router.delete('/:id', removeProduct);
router.get('/:id', getProductById);

export default router;
