import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { queryOne } from '../../utils/queries';

export const getPermission = async (req: UserRequest, res: Response) => {
  const { id } = req.params;
  const { position, evaluate } = req.user;

  try {
    let permission; 
    
    if (position === '113') {
      permission = await queryOne(`
        SELECT n.lugar, n.tiposol, n.tipomot, n.finicial, n.ffinal, n.hsalida, n.hingreso, n.totald, n.mot, n.hcita, n.fsolicita, CONCAT(p.nombre, ' ', p.apellido) AS name,
          CASE 
            WHEN estatus IS NULL THEN 'Por aprobar'
            WHEN estatus = 'A' THEN 'Aprobado'
            WHEN estatus = 'R' THEN 'Rechazado'
          END AS status
        FROM noper n
        JOIN pers p ON p.codigo = n.codigo
        WHERE numero = ?;
      `, [id]);
    }

    if (position !== '113' && position !== '132' && evaluate === 'S') {
      permission = await queryOne(`
        SELECT n.lugar, n.tiposol, n.tipomot, n.finicial, n.ffinal, n.hsalida, n.hingreso, n.totald, n.mot, n.hcita, n.fsolicita, CONCAT(p.nombre, ' ', p.apellido) AS name,
          CASE 
            WHEN estatus IS NULL THEN 'Por aprobar'
            WHEN supervisor = 'SO' OR supervisor = 'SMA' THEN 'Aprobado'
            WHEN estatus = 'R' AND supervisor = 'R' THEN 'Rechazado'
          END AS status
        FROM noper n
        JOIN pers p ON p.codigo = n.codigo
        WHERE numero = ?;
      `, [id]);
    }

    if ((position === '132') || (position !== '113' && position !== '132' && evaluate !== 'S')) {
      permission = await queryOne(`
        SELECT n.lugar, n.tiposol, n.tipomot, n.finicial, n.ffinal, n.hsalida, n.hingreso, n.totald, n.mot, n.hcita, n.fsolicita, CONCAT(p.nombre, ' ', p.apellido) AS name,
          CASE 
            WHEN estatus IS NULL THEN 'Por aprobar'
            WHEN estatus = 'A' THEN 'Aprobado'
            WHEN estatus = 'R' THEN 'Rechazado'
          END AS status
        FROM noper n
        JOIN pers p ON p.codigo = n.codigo
        WHERE numero = ?;
      `, [id]);
    }

    res.json(permission);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};