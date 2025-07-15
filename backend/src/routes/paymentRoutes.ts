import express from 'express';
import { markPayment, getMonthlyStatus ,getIncomeStats,getDailyIncome} from '../controllers/paymentController';

const router = express.Router();

router.post('/', markPayment);
router.get('/status', getMonthlyStatus);
// routes/paymentRoutes.ts
router.get('/income', getIncomeStats);
router.get('/daily-income', getDailyIncome);

export default router;
