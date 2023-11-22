import { Response } from 'express';
import { Request } from '../../types/user';
import { query } from '../../utils/queries';

/**
 * User log out.
 */
export const logOut = async (req: Request, res: Response) => {
  try {
    // remove fcmToken
    await query(`
      UPDATE 
        pers p
      JOIN usuario u 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      SET p.token = ''
      WHERE 
        p.codigo = ?;
    `, [req.user.codigo]);
  
    // success
    res.json({ msg: 'Log out successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};