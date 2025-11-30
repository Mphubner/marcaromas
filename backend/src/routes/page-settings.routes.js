import express from 'express';
import { getSettingsBySection } from '../controllers/settings.controller.js';

const router = express.Router();

router.get('/:section', getSettingsBySection);

export default router;