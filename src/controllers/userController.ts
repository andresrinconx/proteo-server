import { Request, Response } from 'express';
import { getMessaging } from 'firebase-admin/messaging';
import pool from '../config/db';

/**
 * User auth.
 */
export const auth = async (req: Request, res: Response) => {
  const { user: username, password } = req.body;

  const [user] = await pool.promise().query(`SELECT b.codigo, b.cedula FROM usuario a JOIN pers b ON SUBSTRING(a.cedula, 2) = b.cedula WHERE a.us_codigo = "${username}" AND a.us_clave = "${password}"`);

  // not found
  if ((user as []).length === 0) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  // insert fcmToken
  

  // success
  res.json(user[0]);
};

/**
 * Create user permission, check supervisors and send push notification.
 */
export const createPermission = async (req: Request, res: Response) => {
  // const { user, lugar, codigo, tiposol, tipomot, fechainicial, fechafinal, horasalida, horaentrada, totalhoras, motivo, horacita } = req.body

  // create permission
  const [permission] = await pool.promise().query(``);
  console.log(permission);

  // PUSH NOTIFICATION

  // get tokens
  const [supervisors] = await pool.promise().query('');

  // not found
  if ((supervisors as [])?.length < 1) {
    const error = new Error('Supervisors not found');
    return res.status(404).json({ msg: error.message });
  }

  // send push notification
  const tokens = [];
  try {
    await getMessaging().sendEachForMulticast({
      notification: {
        title: 'Test',
        body: 'Test Notification',
      },
      tokens,
    });
    res.status(200).json({ msg: 'Messages sent successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};