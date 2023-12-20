import { Response } from 'express';
import { UserRequest } from '../../types/user';
import { query, queryOne } from '../../utils/queries';
import { getFullDate } from '../../utils/dates';
import { fcmSend } from '../../helpers/fcm';
import { whatsAppSend } from '../../helpers/whatsApp';
import { newSerialization } from '../../helpers/queries';
import { getPermissionToBoss } from '../../helpers/queries';

interface Boss {
  token: string;
  phone: string;
}

export const createPermission = async (req: UserRequest, res: Response) => {
  const { lugar, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita } = req.body;
  const { code, usCode, name } = req.user;

  // create permission
  try {
    const serialization = await newSerialization();

    await query(`
      INSERT INTO nnoper (usuario, fecha)
      VALUES (?, ?);

      INSERT INTO noper (numero, lugar, codigo, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usuario)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [usCode, getFullDate(new Date()), serialization, lugar, code, tiposol, tipomot, finicial, ffinal, hsalida, hingreso, totald, mot, hcita, fsolicita, usCode]);

    res.json(await getPermissionToBoss(serialization));
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  // messaging
  try {
    let boss;
    if (tipomot === 'M') { 
      boss = await queryOne<Boss>(`
        SELECT 
          fcm AS token, 
          telefono AS phone 
        FROM pers 
        WHERE
          status = 'A' 
          AND cargo = '113';
      `);
    } else { 
      boss = await queryOne<Boss>(`
        SELECT
          p2.fcm AS token,
          p2.telefono AS phone
        FROM pers p1
        JOIN pers p2
          ON p1.evaluador = p2.codigo
        WHERE 
          p1.status = 'A'
          AND p1.codigo = ?;
      `, [code]);
    }

    // messages
    const { token, phone } = boss;
    const title = 'Solicitud de permiso pendiente';
    const body = `${name} te ha solicitado un permiso`;

    if (token) await fcmSend({ title, body, token });
    if (phone) await whatsAppSend({ title, body, phone });
  } catch (error) {
    console.log(error);
  }
};