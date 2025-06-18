import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string };
    }
  }
}

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Not authorized, user ID not found' });
  }

  try {
    const user: IUser | null = await User.findById(req.user.id);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 