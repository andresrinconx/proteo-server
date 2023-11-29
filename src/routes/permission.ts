import express from 'express';
import { approvePermission, editPermission, newPermission, rejectPermission } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

router.post('/new', checkAuth, newPermission);
router.post('/edit', checkAuth, editPermission);
router.put('/approve', checkAuth, approvePermission);
router.put('/reject', checkAuth, rejectPermission);

export default router;