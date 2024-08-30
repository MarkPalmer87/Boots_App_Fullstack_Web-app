// Review Controller file with neccesary functions to add, get, update and delete reviews
export const addReview = async (req, res) => {
    try {
        console.log('Received review:', req.body);
        const { bootId, rating, comment } = req.body;
        const userId = req.user.id;
        const query = 'INSERT INTO reviews (boot_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
        const [result] = await req.pool.query(query, [bootId, userId, rating, comment]);
        console.log('Review added to database:', result);
        res.status(201).json({ id: result.insertId, bootId, userId, rating, comment });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
};

export const getReviews = async (req, res) => {
    try {
        const { bootId } = req.params;
        console.log('Fetching reviews for bootId:', bootId);
        const query = `
            SELECT r.*, u.username 
            FROM reviews r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.boot_id = ?
            ORDER BY r.created_at DESC
        `;
        const [reviews] = await req.pool.query(query, [bootId]);
        console.log('Fetched reviews:', reviews);
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const query = 'UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?';
        await req.pool.query(query, [rating, comment, id, req.user.id]);
        res.json({ message: 'Review updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM reviews WHERE id = ? AND user_id = ?';
        await req.pool.query(query, [id, req.user.id]);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};