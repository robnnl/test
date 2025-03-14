import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CookieOptions } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    organizationId: string;
    role: string;
  }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ error: 'Geen toegang - login vereist' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest['user'];
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Ongeldige token' });
  }
};

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000 // 24 uur
}; 