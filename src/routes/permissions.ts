import express from 'express';
import { approvePermission, updatePermission, createPermission, rejectPermission } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/create', checkAuth, createPermission);
router.put('/update', checkAuth, updatePermission);
router.put('/approve', checkAuth, approvePermission);
router.put('/reject', checkAuth, rejectPermission);

export default router;