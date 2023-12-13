import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query } from '../../utils/queries';

export const getBossPermissions = async (req: UserRequest, res: Response) => {
  const { position, evaluate, code } = req.user;

  if (position !== '113' && position !== '132' && evaluate === 'N') {
    const error = new Error('Invalid action');
    return res.status(403).json({ msg: error.message });
  }

  try {
    let permissions;

    // medical
    if (position === '113') {
      permissions = await query(`
        SELECT
          numero AS id,
          DATE_FORMAT(n.fsolicita, '%d-%m-%Y') AS 'date',
          n.totald AS 'time',
          CONCAT(p.nombre, ' ', p.apellido) AS name,
          CASE 
            WHEN supervisor IS NULL THEN 'Por aprobar'
            WHEN supervisor = 'SM' THEN 'Aprobado'
          END AS status
        FROM noper n
        JOIN pers p ON n.codigo = p.codigo
        WHERE
          tipomot = 'M'
          AND (supervisor IS NULL OR supervisor = 'SM')
          AND fsolicita >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        ORDER BY fsolicita DESC;
      `);
    }

    // boss
    if (position !== '113' && position !== '132' && evaluate === 'S') {
      permissions = await query(`
        SELECT
          numero AS id,
          DATE_FORMAT(n.fsolicita, '%d-%m-%Y') AS 'date',
          n.totald AS 'time',
          CONCAT(p.nombre, ' ', p.apellido) AS name,
          CASE 
            WHEN (supervisor IS NULL AND tipomot = 'O') OR (supervisor = 'SM' AND tipomot = 'M') THEN 'Por aprobar'
            WHEN supervisor = 'SMA' OR supervisor = 'SO' THEN 'Aprobado'
          END AS status
        FROM noper n
        JOIN pers p ON n.codigo = p.codigo
        WHERE
          (
            (supervisor IS NULL AND tipomot = 'O')
            OR (supervisor = 'SM' AND tipomot = 'M')
            OR (supervisor = 'SO' OR supervisor = 'SMA')
          )
          AND p.evaluador = ?
          AND fsolicita >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        ORDER BY fsolicita DESC;
      `, [code]);
    }

    // HR
    if (position === '132') {
      permissions = await query(`
        SELECT
          numero AS id,
          DATE_FORMAT(n.fsolicita, '%d-%m-%Y') AS 'date',
          n.totald AS 'time',
          CONCAT(p.nombre, ' ', p.apellido) AS name,
          CASE 
            WHEN estatus IS NULL THEN 'Por aprobar'
            WHEN estatus = 'A' THEN 'Aprobado'
            WHEN estatus = 'R' THEN 'Rechazado'
          END AS status
        FROM noper n
        JOIN pers p ON n.codigo = p.codigo
        WHERE
          supervisor IS NOT NULL
          AND (supervisor = 'SO' OR supervisor = 'SMA')
          AND fsolicita >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
        ORDER BY fsolicita DESC;
      `);
    }

    res.json(permissions);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};