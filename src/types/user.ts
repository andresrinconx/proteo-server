import { Request } from 'express';

export interface UserRequest extends Request {
  user?: User;
}

export interface User {
  name: string;
  usCode: string;
  idCard: string;
  code: string;
  evaluate: string;
}