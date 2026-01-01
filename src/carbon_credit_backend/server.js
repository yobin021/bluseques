// Import necessary modules using ES syntax
import express from 'express';
import pg from 'pg';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from the root .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

// Initialize the express app
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable Cross-Origin Resource Sharing

const saltRounds = 10; // Salt rounds for bcrypt password hashing

// --- IMPORTANT ---
// Replace these with your actual PostgreSQL database credentials
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test database connection
async function testDbConnection() {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database successfully!');
        client.release();
    } catch (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    }
}
testDbConnection();


// --- API Endpoints ---

// --- In-Memory Mock Database (Fallback) ---
const mockUsers = [];

// 1. Sign-up Endpoint
app.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Try Real DB first
        try {
            const userCheck = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
            if (userCheck.rows.length > 0) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await pool.query('INSERT INTO companies (fullname, email, password, role) VALUES ($1, $2, $3, $4)', [fullname, email, hashedPassword, role]);
            return res.status(201).json({ message: 'User created successfully! (DB)' });
        } catch (dbErr) {
            console.warn('Real DB failed, using Mock DB for demo:', dbErr.message);
            // Fallback to Mock DB
            if (mockUsers.find(u => u.email === email)) {
                return res.status(409).json({ message: 'User with this email already exists.' });
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = { id: Date.now(), fullname, email, password: hashedPassword, role };
            mockUsers.push(newUser);
            return res.status(201).json({ message: 'User created successfully! (Mock Mode)' });
        }

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// 2. Sign-in Endpoint
app.post('/signin', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        let user;

        // Try Real DB first
        try {
            const result = await pool.query('SELECT * FROM companies WHERE email = $1', [email]);
            user = result.rows[0];
        } catch (dbErr) {
            console.warn('Real DB failed, using Mock DB for demo:', dbErr.message);
            // Fallback to Mock DB
            user = mockUsers.find(u => u.email === email);
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found. (If using Mock Mode, did you Sign Up first?)' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (user.role !== role) {
            return res.status(401).json({ message: 'Role mismatch.' });
        }

        res.status(200).json({
            message: 'Sign-in successful!',
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});