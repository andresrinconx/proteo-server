import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query } from '../../utils/queries';

export const rejectPermission = async (req: UserRequest, res: Response) => {
  const { position } = req.user;
  const { id } = req.body;

  if (position !== '132') {
    const error = new Error('Invalid action');
    return res.status(403).json({ msg: error.message });
  }

  try {
    await query(`
      UPDATE noper 
      SET estatus = 'R'
      WHERE numero = ?;
    `, [id]);

    res.json({ msg: 'Permission approved successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};