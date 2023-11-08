import { createPool } from 'mysql2';

// Datasis pool
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 100,
  multipleStatements: true
});

// Query
export const query = async (query: string) => {
  const [results] = await pool.promise().query(query);
  return results;
};