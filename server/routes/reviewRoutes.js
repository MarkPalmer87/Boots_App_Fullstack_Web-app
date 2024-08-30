import express from 'express';
import { addReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Place the /counts route first
router.get('/counts', authenticateToken, async (req, res) => {
    try {
        const [rows] = await req.pool.query('SELECT boot_id, COUNT(*) as count FROM reviews GROUP BY boot_id');
        const counts = rows.reduce((acc, row) => {
            acc[row.boot_id] = parseInt(row.count);
            return acc;
        }, {});
        console.log('Sending review counts:', counts);
        res.json(counts);
    } catch (error) {
        console.error('Error fetching review counts:', error);
        res.status(500).json({ message: 'Error fetching review counts', error: error.message });
    }
});

// Then place the other routes
router.post('/', authenticateToken, addReview);
router.get('/:bootId', getReviews);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

export default router;