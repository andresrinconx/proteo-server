import jsonwebtoken from 'jsonwebtoken';

export const generateJWT = (code: string) => {
  return jsonwebtoken.sign({ code }, process.env.JWT_SECRET, { expiresIn: '1y' });
};