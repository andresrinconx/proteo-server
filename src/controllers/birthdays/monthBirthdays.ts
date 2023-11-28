import { Request, Response } from 'express';
import { query } from '../../utils/queries';

export const monthBirthdays = async (req: Request, res: Response) => {
  try {
    const dbMonthBirthdays = await query(`
      SELECT 
        SUBSTRING(nacimi, 9) AS day,
        CONCAT(nombre, ' ', apellido) AS name
      FROM pers
      WHERE 
        status = 'A' 
        AND nacimi != '0000-00-00'
        AND nacimi IS NOT NULL 
        AND MONTH(nacimi) = MONTH(CURRENT_DATE)
      ORDER BY day
    `);
    res.json(dbMonthBirthdays);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};