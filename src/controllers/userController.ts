import { Request, Response } from 'express';
import { query } from '../config/db';
import { getFullDate } from '../helpers/dates';
import { fcmSend } from '../helpers/fcm';
import { whatsAppSend } from '../helpers/whatsApp';

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
      SET p.token = ${fcmToken}
      WHERE 
        u.us_codigo = '${username}' 
        AND u.us_clave = '${password}';
    `);
  
    // get user
    const rowsUser: any = await query(`
      SELECT p.codigo, p.cedula FROM usuario u
      INNER JOIN pers p 
        ON SUBSTRING(u.cedula, 2) = p.cedula
      WHERE 
        u.us_codigo = '${username}' 
        AND u.us_clave = '${password}';
    `);
  
    // not found
    if (rowsUser.length === 0) {
      const error = new Error('User not found');
      return res.status(404).json({ msg: error.message });
    }
  
    // success
    res.json(rowsUser[0]);
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
  
    // get boss data
    let rowsBoss: any = [];
    
    if (tipomot === 'M') { 
      rowsBoss = await query(`
        SELECT token, telefono FROM pers WHERE cargo = '113';
      `);
    } else { 
      rowsBoss = await query(`
        
      `);
    }

    // get user data
    const rowsUser: any = await query(`
      SELECT CONCAT(nombre, ' ', apellido) AS full_name FROM pers WHERE codigo = '${code}'
    `);

    // send messages
    if (rowsBoss?.length > 0) {
      await fcmSend({ 
        title: 'Solicitud de permiso', 
        body: `${rowsUser[0]?.full_name} ha solicitado un permiso.`, 
        token: rowsBoss[0].token 
      });
      await whatsAppSend(
        `Solicitud de permiso. ${rowsUser[0]?.full_name} ha solicitado un permiso.`,
        // `${rowsBoss[0]?.telefono}`
        '04149769740'
      );
    }

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