// Database config
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log('Connecting to DB:', process.env.DATABASE_URL);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed', err);
  } else {
    console.log('Database connected at:', res.rows[0].now);
  }
});


export default pool;
