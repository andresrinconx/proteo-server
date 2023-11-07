import express from 'express';
import { createPermission, auth } from '../controllers/userController';

const router = express.Router();

router.post('/login', auth);
router.post('/permission', createPermission);

export default router;