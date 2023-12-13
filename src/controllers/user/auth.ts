import { Request, Response } from 'express';
import { query, queryOne } from '../../utils/queries';
import { authResponse } from '../../helpers/responses';
import { AuthResponse } from '../../types/user';

export const auth = async (req: Request, res: Response) => {
  const { user: username, password, fcmToken } = req.body;

  try {
    // insert fcmToken
    await query(`
      UPDATE pers p
      JOIN usuario u 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      SET p.fcm = ?
      WHERE 
        u.us_codigo = ? 
        AND u.us_clave = ?;
    `, [fcmToken, username, password]);
  
    // get user
    const user = await queryOne<AuthResponse>(`
      SELECT 
        p.codigo AS code, 
        p.evalua AS evaluate,
        p.cargo AS position 
      FROM usuario u
      JOIN pers p 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      WHERE 
        p.status = 'A'
        AND u.us_codigo = ? 
        AND u.us_clave = ?;
    `, [username, password]);

    if (!user) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }

    const { code, evaluate, position } = user;
    res.json(authResponse({ code, evaluate, position }));
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};