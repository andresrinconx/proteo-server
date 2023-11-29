import { Response } from 'express';
import { UserRequest } from '../../types/user';
import { authResponse } from '../../helpers/responses';

/**
 * If the user is logged in, create a new jwt.
 */
export const validateToken = (req: UserRequest, res: Response) => {
  const { code, evaluate, position } = req.user;
  res.json(authResponse({ code, evaluate, position }));
};