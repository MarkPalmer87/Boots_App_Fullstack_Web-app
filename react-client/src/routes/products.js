import express from 'express';

const router = express.Router();

/*************************************************************************
   * INSERT (POST)
*************************************************************************/
router.post("/", async (req, res) => {             //localhost:5000/products/ [POST]
    try {
      const { name, brand, size, color, price } = req.body;
      const [{ insertId }] = await req.pool.query(
        `INSERT INTO leather_boots (name, brand, size, color, price) 
            VALUES (?, ?, ?, ?, ?)`,
        [name, brand, size, color, price]
      );
      res.status(202).json({
        message: "Product Created",
        id: insertId
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});
/*************************************************************************
 * QUERY (GET)
*************************************************************************/
router.get("/", async(req, res) => {               //localhost:5000/products/ [GET]
    try {
        const [data] = await req.pool.query(
          `SELECT * from leather_boots;`
        );
        res.status(200).json({
          products: data,
        });
      } catch (err) {
        res.status(500).json({
          message: err.message,
        });
      }
});
/*************************************************************************
 * QUERY BY ID (GET)
*************************************************************************/
router.get("/:id", async(req, res) => {             //localhost:5000/products/:id [GET]
    try {
        const {id} = req.params
        const [data] = await req.pool.query(
          `SELECT * from leather_boots where id = ?`,[id]
        );
        if (data.length === 0) {
          return res.status(404).json({
            message: "Product not found",
          });
        }
        res.status(200).json({
          product: data[0],
        });
      } catch (err) {
        res.status(500).json({
          message: err.message,
        });
      }
});
/*************************************************************************
 * UPDATE (PATCH)
*************************************************************************/
router.patch("/:id", async (req, res) => {         //localhost:5000/products/:id [PATCH]
    try {
      const { id } = req.params;
      const { name, brand, size, color, price } = req.body;
      const [result] = await req.pool.query(
          `UPDATE leather_boots SET name = ?, brand = ?, size = ?, color = ?, price = ? WHERE id = ?`,
          [name, brand, size, color, price, id]
        );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      res.status(200).json({
        message: "Product updated",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  });
/*************************************************************************
 * DELETE (DELETE)
*************************************************************************/
router.delete("/:id", async (req, res) => {           //localhost:5000/products/:id [DELETE]
    try {
      const { id } = req.params;
      const [result] = await req.pool.query(
          `DELETE FROM leather_boots WHERE id = ?`,
          [id]
        );
      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      res.status(200).json({
        message: "Product deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
});
export default router; // makes the router publicly available