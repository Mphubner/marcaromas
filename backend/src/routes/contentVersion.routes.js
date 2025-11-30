import express from 'express';
import {
    getVersions,
    createVersion,
    restoreVersion
} from '../controllers/contentVersion.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminMiddleware } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// All version routes require admin
router.use(authMiddleware, adminMiddleware);

router.get('/:id/versions', getVersions);
router.post('/:id/versions', createVersion);
router.post('/:id/versions/:version/restore', restoreVersion);

export default router;
