import { Request, Response } from 'express';
import { query } from '../../config/db';

/**
 * User auth.
 */
const auth = async (req: Request, res: Response) => {
  const { user: username, password, fcmToken } = req.body;

  try {
    // insert fcmToken
    await query(`
      UPDATE pers p
      JOIN usuario u 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      SET p.token = ${fcmToken}
      WHERE 
        u.us_codigo = '${username}' 
        AND u.us_clave = '${password}';
    `);
  
    // get user
    const user: any = await query(`
      SELECT p.codigo, p.cedula FROM usuario u
      INNER JOIN pers p 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      WHERE 
        u.us_codigo = '${username}' 
        AND u.us_clave = '${password}';
    `);
  
    // not found
    if (user.length === 0) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }
  
    // success
    res.json(user[0]);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

export default auth;