import { Request, Response } from 'express';
import Area from '../models/Area';

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const createArea = async (req: CustomRequest, res: Response) => {
  try {
    const rawName = req.body.areaName;
    if (!rawName || typeof rawName !== 'string') {
      return res.status(400).json({ message: 'Area name is required' });
    }

    const cleanedName = rawName.replace(/\s+/g, '').toLowerCase(); // remove all spaces + lowercase

    // Find all areas and compare cleaned names
    const existingAreas = await Area.find({});
    const duplicate = existingAreas.find(
      (a) => a.areaName.replace(/\s+/g, '').toLowerCase() === cleanedName
    );

    if (duplicate) {
      return res.status(400).json({ message: '⚠️ Area already exists (case or space-insensitive)' });
    }

    const area = await Area.create({
      areaName: rawName.trim(), // store as typed (with spacing/caps)
      createdBy: req.user?.id,
    });

    res.status(201).json(area);
  } catch (err) {
    res.status(400).json({ message: '❌ Failed to add area' });
  }
};

export const getAreas = async (_req: Request, res: Response) => {
  const areas = await Area.find().sort({ areaName: 1 });
  res.json(areas);
};
