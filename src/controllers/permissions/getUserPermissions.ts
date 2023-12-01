import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query } from '../../utils/queries';

export const getUserPermissions = async (req: UserRequest, res: Response) => {
  const { code } = req.user;

  try {
    const permissions = await query(`
      SELECT 
        DATE_FORMAT(fsolicita, '%d-%m-%Y') AS 'date',
        lugar AS place,
        CASE 
          WHEN estatus = 'A' THEN 'Aprobado'
          WHEN estatus = 'R' THEN 'Rechazado'
          ELSE 'Pendiente'
        END AS status
      FROM noper 
      WHERE codigo = ? 
      LIMIT 5;
    `, [code]);

    res.json(permissions);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};