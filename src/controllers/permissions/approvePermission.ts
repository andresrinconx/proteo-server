import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query } from '../../utils/queries';

export const approvePermission = async (req: UserRequest, res: Response) => {
  const { position, evaluate } = req.user;
  const { id } = req.body;

  if (position !== '113' && position !== '132' && evaluate === 'N') {
    const error = new Error('Invalid action');
    return res.status(403).json({ msg: error.message });
  }

  try {
    // medical
    if (position === '113') {
      await query(`
        UPDATE noper 
        SET supervisor = 'SM'
        WHERE numero = ?;
      `, [id]);
    }

    // boss
    if (position !== '113' && position !== '132' && evaluate === 'S') {
      await query(`
        UPDATE noper
        SET supervisor = 
          CASE
            WHEN supervisor = 'SM' THEN 'SMA'
            WHEN supervisor IS NULL OR supervisor = '' THEN 'SO'
            ELSE supervisor
          END
        WHERE numero = ?;
      `, [id]);
    }

    // final
    if (position === '132') {
      await query(`
        UPDATE noper 
        SET estatus = 'A'
        WHERE numero = ?;
      `, [id]);
    }

    res.json({ msg: 'Permission approved successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};