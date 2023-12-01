import express from 'express';
import { payroll } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/', checkAuth, payroll);

export default router;