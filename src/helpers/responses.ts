import { AuthResponse } from '../types/user';
import { generateJWT } from './jwt';

/**
 * Return auth object (jwt and access level).
 */
export const authResponse = (data: AuthResponse) => {
  const { position, evaluate, code } = data;

  return { 
    jwt: generateJWT(code),
    isBoss: evaluate === 'S' || position === '113' || position === '132',
    isHRBoss: evaluate === 'S' && position === '132',
  };
};