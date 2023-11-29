import { Request, Response } from 'express';
import { query } from '../../utils/queries';
import { generateJWT } from '../../helpers/jwt';

interface User {
  code: string;
  evaluate: string;
}

export const auth = async (req: Request, res: Response) => {
  const { user, password, fcmToken } = req.body;

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
    `, [fcmToken, user, password]);
  
    // get user
    const users = await query<User>(`
      SELECT p.codigo AS code, p.evalua AS evaluate FROM usuario u
      JOIN pers p 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      WHERE 
        u.us_codigo = ? 
        AND u.us_clave = ?;
    `, [user, password]);
  
    if (users.length === 0) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }

    res.json({ 
      jwt: generateJWT(users[0].code),
      isBoss: users[0].evaluate === 'S' ? true : false,
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};