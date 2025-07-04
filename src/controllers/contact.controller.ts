import { Request, Response } from 'express';
import { identifyContact } from '../services/contact.service';

export const identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;

    const result = await identifyContact(email, phoneNumber);
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Error identifying contact' });
  }
};
