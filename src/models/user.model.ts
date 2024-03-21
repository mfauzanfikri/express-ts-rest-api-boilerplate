import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
const UserModel: PrismaClient['user'] = prisma.user;

export type UserResource = {
  id: number;
  username: string;
  roleId: number;
  role: string;
};

export type UserPostData = {
  username: string;
  password: string;
  roleId: number;
};

export type UserPutData = {
  username?: string;
  password?: string;
  roleId?: number;
};

export type UserResult = User;

export default UserModel;
