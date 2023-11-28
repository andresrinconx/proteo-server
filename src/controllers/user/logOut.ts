import { Response } from 'express';
import { UserRequest } from '../../types/user';
import { query } from '../../utils/queries';

export const logOut = async (req: UserRequest, res: Response) => {
  try {
    // remove fcmToken
    await query(`
      UPDATE 
        pers p
      JOIN usuario u 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      SET p.fcm = ''
      WHERE 
        p.codigo = ?;
    `, [req.user.code]);
  
    res.json({ msg: 'Log out successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};