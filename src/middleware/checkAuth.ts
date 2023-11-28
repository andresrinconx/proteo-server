import jsonwebtoken from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { UserRequest, User } from '../types/user';
import { query } from '../utils/queries';

export const checkAuth = async (req: UserRequest, res: Response, next: NextFunction) => {
  let jwt: string;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      jwt = req.headers.authorization.split(' ')[1];
      const { code } = jsonwebtoken.verify(jwt, process.env.JWT_SECRET) as { code: string };
      const dbUser = await query<User>(`
        SELECT 
          u.us_nombre AS name, 
          u.us_codigo AS usCode, 
          u.cedula AS idCard, 
          p.codigo AS code,
          p.evalua AS evaluate
        FROM 
          usuario u 
        INNER JOIN pers p
          ON SUBSTRING(u.cedula, 2) = p.cedula
        WHERE 
          p.codigo = ?; 
      `, [code]);

      req.user = dbUser[0];

      return next();
    } catch (error) {
      return res.status(403).json({ msg: error.message });
    }
  }

  if (!jwt) {
    const error = new Error('Not authorized');
    res.status(403).json({ msg: error.message });
  }
};