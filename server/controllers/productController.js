export const getProducts = async (req, res) => {
    try {
        const { search } = req.query;
        console.log('Search query in controller:', search); // Add this log
        let query = 'SELECT * FROM leather_boots';
        let params = [];

        if (search) {
            query += ' WHERE name LIKE ? OR brand LIKE ? OR color LIKE ?';
            params = [`%${search}%`, `%${search}%`, `%${search}%`];
        }

        const [products] = await req.pool.query(query, params);
        console.log('Products found:', products); // Add this log
        return products; // Return the products instead of sending the response
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error; // Throw the error to be caught in the route handler
    }
};

export const addProduct = async (req, res) => {
    const { name, brand, color, price, sizes } = req.body;
    const connection = await req.pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query(
            'INSERT INTO leather_boots (name, brand, color, price) VALUES (?, ?, ?, ?)',
            [name, brand, color, price]
        );
        const bootId = result.insertId;

        if (sizes && sizes.length > 0) {
            const sizeValues = sizes.map(size => [bootId, size]);
            await connection.query('INSERT INTO boot_sizes (boot_id, size) VALUES ?', [sizeValues]);
        }

        await connection.commit();
        res.status(201).json({ id: bootId, name, brand, color, price, sizes });
    } catch (error) {
        await connection.rollback();
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    } finally {
        connection.release();
    }
};

export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, brand, color, price, sizes } = req.body;
    const connection = await req.pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'UPDATE leather_boots SET name = ?, brand = ?, color = ?, price = ? WHERE id = ?',
            [name, brand, color, price, id]
        );

        await connection.query('DELETE FROM boot_sizes WHERE boot_id = ?', [id]);
        if (sizes && sizes.length > 0) {
            const sizeValues = sizes.map(size => [id, size]);
            await connection.query('INSERT INTO boot_sizes (boot_id, size) VALUES ?', [sizeValues]);
        }

        await connection.commit();
        res.json({ id, name, brand, color, price, sizes });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    } finally {
        connection.release();
    }
};

export const removeProduct = async (req, res) => {
    const { id } = req.params;
    const connection = await req.pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query('DELETE FROM boot_sizes WHERE boot_id = ?', [id]);
        await connection.query('DELETE FROM leather_boots WHERE id = ?', [id]);
        await connection.commit();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    } finally {
        connection.release();
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await req.pool.query(`
            SELECT l.*, GROUP_CONCAT(bs.size ORDER BY bs.size) as sizes
            FROM leather_boots l
            LEFT JOIN boot_sizes bs ON l.id = bs.boot_id
            WHERE l.id = ?
            GROUP BY l.id
        `, [id]);

        if (rows.length > 0) {
            const boot = rows[0];
            boot.sizes = boot.sizes ? boot.sizes.split(',').map(Number) : [];
            res.json(boot);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};