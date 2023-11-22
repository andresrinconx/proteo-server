import jwt from 'jsonwebtoken';

export const generateJWT = (code: string) => {
  return jwt.sign({ code }, process.env.JWT_SECRET, { expiresIn: '1y' });
};