import { Response } from 'express';
import { Request } from '../../types/user';
import { query } from '../../utils/queries';
import { getFullDate } from '../../utils/dates';
import { fcmSend } from '../../helpers/fcm';
import { whatsAppSend } from '../../helpers/whatsApp';

interface Boss {
  token: string;
  telefono: string;
}

/**
 * Create user permission, check supervisors and send push notification.
 */
export const newPermission = async (req: Request, res: Response) => {
  const { lugar, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita } = req.body;
  const { codigo, us_codigo, us_nombre } = req.user;

  // create permission
  try {
    await query(`
      INSERT INTO nnoper (usuario, fecha)
      VALUES (?, ?);

      INSERT INTO noper (lugar, codigo, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [us_codigo, getFullDate(new Date()), lugar, codigo, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, us_codigo]);
    
    // get boss data
    try {
      let boss = [];
      if (tipomot === 'M') { 
        boss = await query<Boss>(`
          SELECT token, telefono FROM pers WHERE cargo = '113';
        `);
      } else { 
        boss = await query<Boss>(`

        `);
      }

      // push notification
      try {
        if (boss[0].token !== '') {
          await fcmSend({ 
            title: 'Solicitud de permiso pendiente', 
            body: `${us_nombre} te ha solicitado un permiso.`, 
            token: boss[0]?.token
          });
        }
      } catch (error) {
        console.log(error);
      }

      // whatsApp message
      try {
        if (boss[0].telefono !== '') {
          await whatsAppSend(
            `Solicitud de permiso pendiente. ${us_nombre} te ha solicitado un permiso.`,
            // `${boss[0].telefono}`
            '04149769740'
          );
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({ msg: 'Permission created successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};