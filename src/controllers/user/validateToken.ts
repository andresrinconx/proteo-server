import { Response } from 'express';
import { UserRequest } from '../../types/user';
import { generateJWT } from '../../helpers/jwt';

/**
 * If the user is logged in, create a new jwt.
 */
export const validateToken = (req: UserRequest, res: Response) => {
  const { code, evaluate } = req.user;

  res.json({
    jwt: generateJWT(code),
    isBoss: evaluate === 'S' ? true : false
  });
};