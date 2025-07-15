import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import Customer from '../models/Customer';

// POST /payments → Add a new payment
// POST /payments → Add a new payment
export const markPayment = async (req: Request, res: Response) => {
  const { customerId, month, amount, date } = req.body;

  if (!customerId || !month || !amount || !date) {
    return res.status(400).json({ message: 'customerId, month, amount, and date are required' });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // ✅ Check for existing payment for same customer and month
    const existing = await Payment.findOne({ customerId, month });

if (existing) {
  const existingYear = new Date(existing.date).getFullYear();
  const newYear = new Date(date).getFullYear();

  if (existingYear === newYear) {
    return res.status(409).json({
      message: 'Payment for this customer and month already exists for this year',
    });
  }
}


    const payment = new Payment({
      customerId,
      name: customer.name,
      month,
      date: new Date(date),
      amount,
    });

    await payment.save();
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// GET /payments/status → Monthly payment table
export const getMonthlyStatus = async (req: Request, res: Response) => {
  try {
    const year = Number(req.query.year);
    if (!year) {
      return res.status(400).json({ message: 'Year is required as a query parameter' });
    }

    const customers = await Customer.find({});
    const payments = await Payment.find({
      date: {
        $gte: new Date(`${year}-01-01T00:00:00Z`),
        $lte: new Date(`${year}-12-31T23:59:59Z`),
      },
    });

    const result = customers.map((c) => {
      const monthlyStatus: {
        [key: string]: { paid: boolean; amount?: number; date?: string };
      } = {
        Jan: { paid: false },
        Feb: { paid: false },
        Mar: { paid: false },
        Apr: { paid: false },
        May: { paid: false },
        Jun: { paid: false },
        Jul: { paid: false },
        Aug: { paid: false },
        Sep: { paid: false },
        Oct: { paid: false },
        Nov: { paid: false },
        Dec: { paid: false },
      };

      payments
        .filter((p) => p.customerId.toString() === c._id.toString())
        .forEach((p) => {
          const paymentYear = new Date(p.date).getFullYear();
          if (paymentYear === year && monthlyStatus[p.month]) {
            monthlyStatus[p.month] = {
              paid: true,
              amount: p.amount,
              date: p.date.toISOString().split('T')[0],
            };
          }
        });

      return {
        _id: c._id,
        name: c.name,
        area: c.area,
        phone: c.phone,
        payments: monthlyStatus,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get payment status', error });
  }
};


// controllers/paymentController.ts

export const getIncomeStats = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({});

    const monthlyIncome: { [month: string]: number } = {
      Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
      Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
    };

    let totalIncome = 0;

    payments.forEach((payment) => {
      const month = payment.month;
      monthlyIncome[month] += payment.amount;
      totalIncome += payment.amount;
    });

    res.json({ monthlyIncome, totalIncome });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch income stats', error });
  }
};

export const getDailyIncome = async (req: Request, res: Response) => {
  const { month, year } = req.query;

  const numericMonth = Number(month); // 1–12 expected
  const numericYear = Number(year);

  if (!numericMonth || !numericYear) {
    return res.status(400).json({ message: 'Month and year are required' });
  }

  try {
    const startDate = new Date(numericYear, numericMonth - 1, 1);
    const endDate = new Date(numericYear, numericMonth, 1); // start of next month

    const dailyIncome = await Payment.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          total: 1,
        },
      },
      {
        $sort: { day: 1 },
      },
    ]);

    // Convert to object: { "1": 200, "2": 350, ... }
    const result: { [key: string]: number } = {};
    dailyIncome.forEach((entry) => {
      result[entry.day] = entry.total;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get daily income', error });
  }
};