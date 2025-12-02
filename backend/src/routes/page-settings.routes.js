import express from 'express';
import { getSection } from '../controllers/settings.controller.js';

const router = express.Router();

router.get('/:section', getSection);

export default router;