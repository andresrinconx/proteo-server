import { UserRequest } from '../../types/user';
import { Response } from 'express';

export const profile = (req: UserRequest, res: Response) => {
  const { name, email, phone, idCard } = req.user;
  res.status(200).json({ name, email, phone, idCard });
};