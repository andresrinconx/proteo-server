import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query, queryOne } from '../../utils/queries';
import { fcmSend } from '../../helpers/fcm';
import { whatsAppSend } from '../../helpers/whatsApp';

interface Permission {
  name: string;
  place: string;
  token: string;
  phone: string;
  code: string;
}

interface Boss {
  token: string;
  phone: string;
}

export const approvePermission = async (req: UserRequest, res: Response) => {
  const { position, evaluate } = req.user;
  const { id } = req.body;

  if (position !== '113' && position !== '132' && evaluate === 'N') {
    const error = new Error('Invalid action');
    return res.status(403).json({ msg: error.message });
  }

  // message data
  let token: string;
  let phone: string;
  let title: string;
  let body: string;

  try {
    const permission = await queryOne<Permission>(`
      SELECT 
        CONCAT(p.nombre, ' ', p.apellido) AS name,
        n.lugar AS place,
        p.fcm AS token,
        p.telefono AS phone,
        p.codigo AS code
      FROM noper n
      JOIN pers p ON p.codigo = n.codigo
      WHERE n.numero = ?;
    `, [req.body.id]);

    // ***********************************************
    // APPROVALS
    // ***********************************************

    // medical
    if (position === '113') {
      await query(`
        UPDATE noper 
        SET supervisor = 'SM'
        WHERE numero = ?;
      `, [id]);

      const boss = await queryOne<Boss>(`
        SELECT
          p2.fcm AS token,
          p2.telefono AS phone
        FROM pers p1
        JOIN pers p2
          ON p1.evaluador = p2.codigo
        WHERE 
          p1.status = 'A'
          AND p1.codigo = ?;
      `, [permission.code]);

      token = boss.token;
      phone = boss.phone;
      title = 'Solicitud de permiso pendiente';
      body = `La solicitud de permiso de ${permission.name} ha sido aprobada por Higiene y Salud`;
    }

    // boss
    if (position !== '113' && position !== '132' && evaluate === 'S') {
      await query(`
        UPDATE noper
        SET supervisor = 
          CASE
            WHEN supervisor = 'SM' THEN 'SMA'
            WHEN supervisor IS NULL OR supervisor = '' THEN 'SO'
            ELSE supervisor
          END
        WHERE numero = ?;
      `, [id]);

      const boss = await queryOne<Boss>(`
        SELECT 
          fcm AS token, 
          telefono AS phone 
        FROM pers 
        WHERE
          status = 'A' 
          AND cargo = '132';
      `, [permission.code]);

      token = boss.token;
      phone = boss.phone;
      title = 'Solicitud de permiso pendiente';
      body = `La solicitud de permiso de ${permission.name} ha sido aprobada por su evaluador directo`;
    }

    // final
    if (position === '132') {
      await query(`
        UPDATE noper 
        SET estatus = 'A'
        WHERE numero = ?;
      `, [id]);

      token = permission.token;
      phone = permission.phone;
      title = 'Solicitud de permiso aprobada';
      body = `Tu solicitud de permiso para "${permission.place}" ha sido aprobada por Talento Humano`;
    }

    res.json({ msg: 'Permission approved successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  // messaging
  try {
    if (token) await fcmSend({ title, body, token });
    if (phone) await whatsAppSend({ title, body, phone });
  } catch (error) {
    console.log(error);
  }
};