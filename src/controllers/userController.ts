import { Request, Response } from 'express'
import { getMessaging } from 'firebase-admin/messaging'
// import pool from '../config/db'

/**
 * Send push notification.
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    await getMessaging().send({
      notification: {
        title: 'Test',
        body: 'Test Notification',
      },
      token: req.body.token
    })
    res.status(200).json({ msg: 'Message sent successfully' })
  } catch (error) {
    return res.status(400).json({ msg: error.message })
  }
}