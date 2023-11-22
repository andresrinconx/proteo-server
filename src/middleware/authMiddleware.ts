import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Request, User } from '../types/user';
import { query } from '../utils/queries';

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token: string;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { code: string };
      const user = await query<User>(`
        SELECT u.us_nombre, u.us_codigo, u.cedula, p.codigo FROM usuario u 
        INNER JOIN pers p
          ON SUBSTRING(u.cedula, 2) = p.cedula
        WHERE 
          p.codigo = ?; 
      `, [decoded.code]);

      req.user = user[0];

      return next();
    } catch (error) {
      return res.status(403).json({ msg: error.message });
    }
  }

  if (!token) {
    const error = new Error('Not authorized');
    res.status(403).json({ msg: error.message });
  }
};