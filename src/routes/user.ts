import express from 'express';
import { auth, validateToken, logOut, profile } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

// Public
router.post('/auth', auth);

// Private
router.get('/validate', checkAuth, validateToken);
router.post('/logout', checkAuth, logOut);
router.get('/profile', checkAuth, profile);

export default router;