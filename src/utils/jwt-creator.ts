import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import KEYS from '../config/keys';

const jwtCreator = (login: string, userId: mongoose.Types.ObjectId): string => {
  const token = `Bearer ${jwt.sign(
    {
      login,
      userId,
    },
    KEYS.JWT_SECRET_KEY,
    { expiresIn: '1m' }
  )}`;
  return token;
};

export default jwtCreator;
