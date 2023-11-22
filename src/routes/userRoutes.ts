import express from 'express';
import { auth, logOut } from '../controllers';
import { checkAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', auth);
router.post('/logout', checkAuth, logOut);

export default router;