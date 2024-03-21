import { compareSync, hashSync } from 'bcryptjs';

type User = {
  username: string;
  password: string;
};

export const verifyPassword = (
  password: string,
  hashedPassword: string
): boolean => {
  return compareSync(password, hashedPassword);
};

export const generateHashedPassword = (password: string): string => {
  return hashSync(password, 12);
};

export const authenticateUser = (user: User, userInDB: User): boolean => {
  if (user.username !== userInDB.username) return false;

  if (!verifyPassword(user.password, userInDB.password)) return false;

  return true;
};
