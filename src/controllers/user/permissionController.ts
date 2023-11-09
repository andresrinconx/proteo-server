import { Request, Response } from 'express';
import { query } from '../../config/db';
import { getFullDate } from '../../helpers/dates';
import { fcmSend } from '../../helpers/fcm';
import { whatsAppSend } from '../../helpers/whatsApp';

/**
 * Create user permission, check supervisors and send push notification.
 */
const permission = async (req: Request, res: Response) => {
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

    // send messages
    const rowsUser: any = await query(`
      SELECT CONCAT(nombre, ' ', apellido) AS full_name FROM pers WHERE codigo = '${code}'
    `);

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

export default permission;