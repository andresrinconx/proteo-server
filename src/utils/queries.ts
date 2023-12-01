import { datasis } from '../config/db';

export const query = async <T>(sql: string, values?: string[]): Promise<T[]> => {
  const [results] = await datasis.promise().query(sql, values);
  return results as T[];
};

export const queryOne = async <T>(sql: string, values?: string[]): Promise<T> => {
  const results = await query(sql, values);
  return results[0] as T;
};