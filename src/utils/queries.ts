import { pool } from '../config/db';

/**
 * Main query.
 */
export const query = async <T>(sql: string, values?: string[]): Promise<T[]> => {
  const [results] = await pool.promise().query(sql, values);
  return results as T[];
};