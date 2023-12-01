import express from 'express';
import { approvePermission, updatePermission, createPermission, rejectPermission, getUserPermissions, getBossPermissions, getPermission } from '../controllers';
import { checkAuth } from '../middleware/checkAuth';

const router = express.Router();

// Boss
router.get('/boss', checkAuth, getBossPermissions);
router.put('/approve', checkAuth, approvePermission);
router.put('/reject', checkAuth, rejectPermission);

// User
router.route('/')
  .get(checkAuth, getUserPermissions)
  .post(checkAuth, createPermission);
  
router.route('/:id')
  .get(checkAuth, getPermission)
  .put(checkAuth, updatePermission);

export default router;