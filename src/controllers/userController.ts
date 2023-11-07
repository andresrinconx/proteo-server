import { Request, Response } from 'express'
import { getMessaging } from 'firebase-admin/messaging'
import pool from '../config/db'

/**
 * User auth.
 */
export const auth = async (req: Request, res: Response) => {
  const { usuario, password } = req.body

  const [user] = await pool.promise().query(`SELECT b.codigo, b.cedula FROM usuario a JOIN pers b ON SUBSTRING(a.cedula, 2) = b.cedula WHERE a.us_codigo = "${usuario}" AND a.us_clave = "${password}"`)

  // not found
  if ((user as []).length === 0) {
    const error = new Error('User not found')
    return res.status(400).json({ msg: error.message })
  }

  // success
  res.json(user[0])
}

/**
 * Create user permission, check supervisors and send push notification.
 */
export const createPermission = async (req: Request, res: Response) => {
  const { user, token } = req.body

  // create permission


  // push notifications
  const supervisors = await pool.promise().query('')

  if (supervisors?.length > 0) {
    try {
      await getMessaging().send({
        notification: {
          title: 'Test',
          body: 'Test Notification',
        },
        token,
      })
      res.status(200).json({ msg: 'Message sent successfully' })
    } catch (error) {
      return res.status(400).json({ msg: error.message })
    }
  }
}