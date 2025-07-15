import express from 'express';
import { createArea, getAreas } from '../controllers/areaController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, createArea);
router.get('/', verifyToken, getAreas);

export default router;
