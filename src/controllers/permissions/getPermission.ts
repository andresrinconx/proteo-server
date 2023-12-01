import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { queryOne } from '../../utils/queries';

export const getPermission = async (req: UserRequest, res: Response) => {
  const { id } = req.params;

  try {
    const permission = await queryOne(`
      SELECT
        n.lugar,
        n.tiposol,
        n.tipomot,
        n.finicial,
        n.ffinal,
        n.hsalida,
        n.hingreso,
        n.totald,
        n.mot,
        n.hcita,
        n.fsolicita,
        CONCAT(p.nombre, ' ', p.apellido) AS name
      FROM noper n
      JOIN pers p ON p.codigo = n.codigo
      WHERE numero = ?;
    `, [id]);

    res.json(permission);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};