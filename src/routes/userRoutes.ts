import express from 'express'
import { sendMessage } from '../controllers/userController'

const router = express.Router()

router.post('/send', sendMessage)

export default router