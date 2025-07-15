import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.use(verifyToken); // protect all routes

router.post('/', createCustomer);
router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
