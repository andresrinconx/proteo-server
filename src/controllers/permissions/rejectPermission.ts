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
}

export const rejectPermission = async (req: UserRequest, res: Response) => {
  const { position } = req.user;
  const { id } = req.body;

  if (position !== '132') {
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
        p.telefono AS phone
      FROM noper n
      JOIN pers p ON p.codigo = n.codigo
      WHERE n.numero = ?;
    `, [id]);

    await query(`
      UPDATE noper 
      SET estatus = 'R'
      WHERE numero = ?;
    `, [id]);

    token = permission.token;
    phone = permission.phone;
    title = 'Solicitud de permiso rechazada';
    body = `Tu solicitud de permiso para "${permission.place}" ha sido rechazada por Talento Humano`;

    res.json({ msg: 'Permission rejected successfully' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  try {
    if (token) await fcmSend({ title, body, token });
    if (phone) await whatsAppSend({ title, body, phone });
  } catch (error) {
    console.log(error);
  }
};