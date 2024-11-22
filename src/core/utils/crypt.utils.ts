import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import * as jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateSHA1(input: string) {
  const shaSum = createHash('sha1');
  shaSum.update(`${new Date().getTime()}.${input}`);
  return shaSum.digest('hex');
}

export const jwtSign = (data: object) => {
  return jwt.sign(data, process.env.JWT_SALT, {
    algorithm: 'HS256',
    expiresIn: process.env.JWT_EXPIRES, // unix seconds
  });
};

export const jwtVerify = (token: string) => {
  return jwt.verify(token, process.env.JWT_SALT, {
    algorithms: ['HS256'],
  });
};
