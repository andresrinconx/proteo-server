import express from 'express';
import { permission, auth, logOut } from '../controllers';

const router = express.Router();

// User session
router.post('/login', auth);
router.post('/logout', logOut);

// User actions
router.post('/permission', permission);

export default router;