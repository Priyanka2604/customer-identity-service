import { Request, Response } from 'express';
import { identifyOrLinkContact } from '../services/identity.service';

export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;
  const result = await identifyOrLinkContact(email, phoneNumber);
  res.json(result);
};
