import express from 'express';
import { auth, validateToken, logOut } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/auth', auth);
router.get('/validate', checkAuth, validateToken);
router.post('/logout', checkAuth, logOut);

export default router;