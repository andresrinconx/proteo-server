import { Request as ExpressRequest } from 'express';

export interface Request extends ExpressRequest {
  user?: User;
}

export interface User {
  us_nombre: string;
  us_codigo: string;
  cedula: string;
  codigo: string
}