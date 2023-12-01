import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query, queryOne } from '../../utils/queries';

interface Permission {
  user: string;
  lugar: string;
  tiposol: string;
  tipomot: string;
  finicial: string;
  ffinal: string;
  hsalida: string;
  hingreso: string;
  totald: string;
  mot: string;
  hcita: string;
  fsolicita: string;
}

export const updatePermission = async (req: UserRequest, res: Response) => {
  try {
    const permission = await queryOne<Permission>(`
      SELECT usuario AS user, lugar, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita
      FROM noper 
      WHERE numero = ?;
    `, [req.body.id]);

    if (!permission) {
      const error = new Error('Not found');
      return res.status(404).json({ msg: error.message });
    }

    if (permission.user !== req.user.usCode) {
      const error = new Error('Invalid action');
      return res.status(403).json({ msg: error.message });
    }

    // update permission
    await query(`
      UPDATE noper 
      SET lugar = ?, tiposol = ?, tipomot = ?, finicial = ?, ffinal = ?, hsalida = ?, hingreso = ?, totald = ?, mot = ?, hcita = ?, fsolicita = ?
      WHERE numero = ?;
    `, [
      req.body.lugar || permission.lugar,
      req.body.tiposol || permission.tiposol,
      req.body.tipomot || permission.tipomot,
      req.body.finicial || permission.finicial,
      req.body.ffinal || permission.ffinal,
      req.body.hsalida || permission.hsalida,
      req.body.hingreso || permission.hingreso,
      req.body.totald || permission.totald,
      req.body.mot || permission.mot,
      req.body.hcita || permission.hcita,
      req.body.fsolicita || permission.fsolicita,
      req.body.id
    ]);

    res.json({ msg: 'Permission updated successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};