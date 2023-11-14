import { Request, Response } from 'express';
import { query } from '../../config/db';
import { getFullDate } from '../../helpers/dates';
import { fcmSend } from '../../helpers/fcm';
import { whatsAppSend } from '../../helpers/whatsApp';

/**
 * Create user permission, check supervisors and send push notification.
 */
const permission = async (req: Request, res: Response) => {
  const { lugar, code, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, user: username } = req.body;

  try {
    // create permission
    await query(`
      INSERT INTO nnoper (usuario, fecha)
      VALUES ('${username}', '${getFullDate(new Date())}');

      INSERT INTO noper (lugar, codigo, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usuario)
      VALUES ('${lugar}', '${code}', '${tiposol}', '${tipomot}', '${finicial}', '${ffinal}', '${hsalida}', '${hingreso}', '${totald}', '${mot}', '${hcita}', '${fsolicita}', '${username}');
    `);
  
    // get boss data
    let boss: any = [];
    
    if (tipomot === 'M') { 
      boss = await query(`
        SELECT token, telefono FROM pers WHERE cargo = '113';
      `);
    } else { 
      boss = await query(`
        
      `);
    }

    // get user data
    const user: any = await query(`
      SELECT CONCAT(nombre, ' ', apellido) AS full_name FROM pers WHERE codigo = '${code}'
    `);

    // send push notification
    if (boss[0]?.token !== '') {
      await fcmSend({ 
        title: 'Solicitud de permiso pendiente', 
        body: `${user[0]?.full_name} te ha solicitado un permiso.`, 
        token: boss[0]?.token
      });
    }

    // send WhatsApp message
    if (boss[0]?.telefono !== '') {
      await whatsAppSend(
        `Solicitud de permiso pendiente. ${user[0]?.full_name} te ha solicitado un permiso.`,
        // `${boss[0]?.telefono}`
        '04149769740'
      );
    }

    res.status(200).json({ msg: 'Permission created successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

export default permission;