import express from 'express';
import { newPermission } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/new', checkAuth, newPermission);

export default router;