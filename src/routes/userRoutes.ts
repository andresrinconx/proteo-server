import express from 'express'
import { allPers, sendMessage } from '../controllers/userController'

const router = express.Router()

router.get('/pers', allPers)
router.post('/send', sendMessage)

export default router