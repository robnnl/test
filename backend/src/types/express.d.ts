import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: string;
        email: string;
        organizationId: string;
        role: string;
      };
      cookies: {
        jwt?: string;
      };
      body: any;
    }
  }
}

export {}; 