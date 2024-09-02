import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import productsRouter from './routes/products.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { authenticateToken } from './middleware/authMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Ideally, use an environment variable

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'boots_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to make pool available in routes
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Register route
app.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { username, password } = req.body;
    
    // Check if username already exists
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    
    const token = jwt.sign({ id: result.insertId, username }, JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: 'User registered successfully', token, user: { id: result.insertId, username } });
  } catch (error) {
    console.error('Detailed registration error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length > 0 && await bcrypt.compare(password, users[0].password)) {
      const token = jwt.sign({ id: users[0].id, username: users[0].username }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: users[0].id, username: users[0].username } });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
});

// Protected routes
app.use('/products', authenticateToken, productsRouter);
app.use('/api/reviews', authenticateToken, reviewRoutes);

// Verify token route
app.post('/verify-token', authenticateToken, (req, res) => {
  res.json({ valid: true, user: { id: req.user.id, username: req.user.username } });
});

// Basic route
app.get('/', (req, res) => {
  res.send("Server is running");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});