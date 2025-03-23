import type { Request} from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string,
}

export const authenticateToken = ({req}:{req:Request}) => {
  let token = req.body?.token || req.query?.token || req.headers?.authorization

  if (req.headers?.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }
  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET_KEY || '', { maxAge: '1h' }) as JwtPayload;
    console.log(data, "this is my data")
    req.user = data;
  } catch (err) {
    console.error(err);
  }
  return req;
  // if (authHeader) {
  //   const token = authHeader.split(' ')[1];

  //   const secretKey = process.env.JWT_SECRET_KEY || '';

  //   jwt.verify(token, secretKey, (err, user) => {
  //     if (err) {
  //       return res.sendStatus(403); // Forbidden
  //     }

  //     req.user = user as JwtPayload;
  //     return next();
  //   });
  // } else {
  //   res.sendStatus(401); // Unauthorized
  // }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
