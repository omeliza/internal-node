import { NextFunction, Request, Response } from 'express';
import schema from './schema';

export const validateOrderDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
