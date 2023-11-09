import { Request, Response } from 'express';
import { getMessaging } from 'firebase-admin/messaging';
import { query } from '../config/db';
import { getFullDate } from '../helpers/dates';

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
      SET p.token = '${fcmToken}'
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
    if ((user as []).length === 0) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }
  
    // success
    res.json(user[0]);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

/**
 * Create user permission, check supervisors and send push notification.
 */
export const createPermission = async (req: Request, res: Response) => {
  const { lugar, code, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, user } = req.body;

  try {
    // create permission
    await query(`
      INSERT INTO nnoper (usuario, fecha)
      VALUES ('${user}', '${getFullDate(new Date())}');

      INSERT INTO noper (lugar, codigo, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usuario)
      VALUES ('${lugar}', '${code}', '${tiposol}', '${tipomot}', '${finicial}', '${ffinal}', '${hsalida}', '${hingreso}', '${totald}', '${mot}', '${hcita}', '${fsolicita}', '${user}');
    `);
  
    // get token
    let token: any = [];
    
    if (tiposol === 'M') { 
      // "token higiene y salud"
      token = await query(`
        
      `);
    } else { 
      // "token jefe"
      token = await query(`
        
      `);
    }

    // // token not found
    if ((token as [])?.length < 1) {
      const error = new Error('Token not found');
      return res.status(404).json({ msg: error.message });
    }
  
    // send push notification
    await getMessaging().send({
      notification: {
        title: 'Test',
        body: 'Test Notification',
      },
      token: ''
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