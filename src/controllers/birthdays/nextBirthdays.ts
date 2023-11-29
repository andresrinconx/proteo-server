import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query } from '../../utils/queries';

export const nextBirthdays = async (req: UserRequest, res: Response) => {
  try {
    const nextBirthdays = await query(`
      SELECT 
        aa.difer AS difference, 
        GROUP_CONCAT(aa.nombre) AS name
      FROM (
        SELECT
          CONCAT(a.nombre,' ',a.apellido) AS nombre,
          DATEDIFF(CONCAT(YEAR(CURDATE()),DATE_FORMAT(a.nacimi,'%m%d')),CURDATE()) AS difer
        FROM pers AS a
        WHERE a.status='A' AND a.nacimi<>'0000-00-00' AND a.nacimi IS NOT NULL 
        HAVING difer BETWEEN 0 AND 2
      ) AS aa GROUP BY aa.difer ORDER BY aa.difer
    `);
    res.json(nextBirthdays);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};