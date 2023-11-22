import { Request, Response } from 'express';
import { query } from '../../utils/queries';
import { generateJWT } from '../../helpers/jwt';

interface User {
  codigo: string;
}

/**
 * User auth.
 */
export const auth = async (req: Request, res: Response) => {
  const { user: username, password, fcmToken } = req.body;

  try {
    // insert fcmToken
    await query(`
      UPDATE pers p
      JOIN usuario u 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      SET p.token = ?
      WHERE 
        u.us_codigo = ? 
        AND u.us_clave = ?;
    `, [fcmToken, username, password]);
  
    // get user
    const user = await query<User>(`
      SELECT p.codigo FROM usuario u
      INNER JOIN pers p 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      WHERE 
        u.us_codigo = ? 
        AND u.us_clave = ?;
    `, [username, password]);
  
    // not found
    if (user.length === 0) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }
  
    // success
    res.json({ 
      ...user[0], 
      token: generateJWT(user[0].codigo) 
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};