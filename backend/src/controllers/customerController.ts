import { Request, Response } from 'express';
import Customer from '../models/Customer';

// ✅ Define user payload interface
interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// ➕ Create Customer (with duplicate prevention)
export const createCustomer = async (req: CustomRequest, res: Response) => {
  try {
    const { name, area, phone, info } = req.body;

    if (!name || !area || !phone) {
      return res.status(400).json({ message: '❌ Name, Area, and Phone are required' });
    }

    // Normalize fields (remove spaces + lowercase)
    const cleanedName = name.replace(/\s+/g, '').toLowerCase();
    const cleanedArea = area.replace(/\s+/g, '').toLowerCase();
    const cleanedPhone = phone.trim();

    // Check for duplicates
    const existing = await Customer.find({});
    const duplicate = existing.find((c) =>
  (c.name ?? '').replace(/\s+/g, '').toLowerCase() === cleanedName &&
  (c.area ?? '').replace(/\s+/g, '').toLowerCase() === cleanedArea &&
  (c.phone ?? '').trim() === cleanedPhone
);


    if (duplicate) {
      return res.status(400).json({
        message: '⚠️ Customer with same name, area, and phone already exists',
      });
    }

    // Save new customer
    const customer = await Customer.create({
      name: name.trim(),
      area: area.trim(),
      phone: cleanedPhone,
      info,
      createdBy: req.user?.id,
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: '❌ Failed to add customer' });
  }
};

// 📥 Get All Customers
export const getCustomers = async (_req: Request, res: Response) => {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json(customers);
};

// 🔍 Get One Customer
export const getCustomer = async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).json({ message: '❌ Customer not found' });
  res.json(customer);
};

// ✏️ Update Customer
export const updateCustomer = async (req: Request, res: Response) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: '❌ Customer not found' });
  res.json(updated);
};

// 🗑️ Delete Customer
export const deleteCustomer = async (req: Request, res: Response) => {
  const deleted = await Customer.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: '❌ Customer not found' });
  res.json({ message: '✅ Customer deleted' });
};
