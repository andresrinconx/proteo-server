import { Request, Response } from 'express';
import { getMessaging } from 'firebase-admin/messaging';
import { query } from '../config/db';

/**
 * User auth.
 */
export const auth = async (req: Request, res: Response) => {
  const { user: username, password, fcmToken } = req.body;

  // insert fcmToken
  await query(`
    UPDATE pers p
    JOIN usuario u 
      ON SUBSTRING(u.cedula, 2) = p.cedula
    SET p.token = '${fcmToken}'
    WHERE 
      u.us_codigo = '${username}' 
      AND u.us_clave = '${password}';
  `);

  // get user
  const user = await query(`
    SELECT p.codigo, p.cedula FROM usuario u
    INNER JOIN pers p 
      ON SUBSTRING(u.cedula, 2) = p.cedula
    WHERE 
      u.us_codigo = '${username}' 
      AND u.us_clave = '${password}';
  `);

  // not found
  if ((user as []).length === 0) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  res.json(user[0]);
};

/**
 * Create user permission, check supervisors and send push notification.
 */
export const createPermission = async (req: Request, res: Response) => {
  // const { user, lugar, codigo, tiposol, tipomot, fechainicial, fechafinal, horasalida, horaentrada, totalhoras, motivo, horacita } = req.body

  // create permission
  const permission = await query(``);
  console.log(permission);

  // get supervisors tokens
  const supervisors = await query('');

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
      tokens
    });
    res.status(200).json({ msg: 'Messages sent successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

/**
 * User log out.
 */
export const logOut = async (req: Request, res: Response) => {
  const { code } = req.body;

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
};