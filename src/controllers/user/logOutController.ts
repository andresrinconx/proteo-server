import { Request, Response } from 'express';
import { query } from '../../config/db';

/**
 * User log out.
 */
const logOut = async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    // remove fcmToken
    await query(`
      UPDATE 
        pers p
      JOIN usuario u 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      SET p.token = ''
      WHERE 
        p.codigo = '${code}'
    `);
  
    // success
    res.json({ msg: 'Log out successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

export default logOut;