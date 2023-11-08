import express from 'express';
import { createPermission, auth, logOut } from '../controllers/userController';

const router = express.Router();

// User session
router.post('/login', auth);
router.post('/logout', logOut);

// User actions
router.post('/permission', createPermission);

export default router;