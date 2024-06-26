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
  email: string;
  phone: string;
  position: string;
}

export interface AuthResponse {
  code: string;
  evaluate: string;
  position: string;
}