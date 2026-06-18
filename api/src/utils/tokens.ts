import { UserPayload } from '@/shared/user-schema';
import jwt from 'jsonwebtoken';
import type { Response } from 'express';

export const generateAccessToken = (payload: UserPayload) => {
  return jwt.sign(payload, process.env.ACCESS_SECRET!, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: {id: string}) => {
  return jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: '7d' });
};


export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,   
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 mins in ms
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });
};