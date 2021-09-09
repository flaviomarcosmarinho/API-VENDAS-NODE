import auth from '@config/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export default function isAutenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  // Bearer sdfjhskdf56465df6sd5v165s6d5f6s54ds1d2
  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, auth.jwt.secret);

    const { sub } = decodedToken;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token.');
  }
}
