/**
 * This middleware checks if the user is authorized to access the resources.
 */
import jsonwebtoken from 'jsonwebtoken';
import { NextFunction } from 'express';

export default (req: any, res: any, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jsonwebtoken.verify(token, 'supersecretkey');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = (decodedToken as jsonwebtoken.JwtPayload).userId;
  return next();
};
