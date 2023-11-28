import express from 'express';
import { monthBirthdays, nextBirthdays } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.get('/month', checkAuth, monthBirthdays);
router.get('/next', checkAuth, nextBirthdays);

export default router;