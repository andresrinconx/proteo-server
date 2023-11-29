import { Response } from 'express';
import { UserRequest } from '../../types/user';
import { query } from '../../utils/queries';
import { getFullDate } from '../../utils/dates';
import { fcmSend } from '../../helpers/fcm';
import { whatsAppSend } from '../../helpers/whatsApp';

interface Boss {
  token: string;
  phone: string;
}

export const newPermission = async (req: UserRequest, res: Response) => {
  const { lugar, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita } = req.body;
  const { code, usCode, name } = req.user;

  // create permission
  try {
    await query(`
      INSERT INTO nnoper (usuario, fecha)
      VALUES (?, ?);

      INSERT INTO noper (lugar, codigo, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [usCode, getFullDate(new Date()), lugar, code, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usCode]);
    
    // get boss data
    try {
      let bosses = [];
      if (tipomot === 'M') { 
        bosses = await query<Boss>(`
          SELECT 
            fcm, 
            telefono AS phone 
          FROM pers 
          WHERE
            p.status = 'A' 
            AND cargo = '113';
        `);
      } else { 
        bosses = await query<Boss>(`
          SELECT
            p2.fcm,
            p2.telefono AS phone
          FROM pers p1
          JOIN pers p2
            ON p1.evaluador = p2.codigo
          WHERE 
            p1.status = 'A'
            AND p1.codigo = ?;
        `, [code]);
      }
      const boss = bosses[0];

      // push notification
      try {
        if (boss.token) {
          await fcmSend({ 
            title: '(PRUEBA) Solicitud de permiso pendiente', 
            body: `${name} te ha solicitado un permiso.`, 
            token: boss?.token
          });
        }
      } catch (error) {
        console.log(error);
      }

      // whatsApp message
      try {
        if (boss.phone) {
          await whatsAppSend(
            `(PRUEBA) Solicitud de permiso pendiente. ${name} te ha solicitado un permiso.`,
            // `${boss.phone}`
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