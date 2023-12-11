import { User, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const UserModel: PrismaClient['user'] = prisma.user;

export const findUserById = async (id: number) => {
  const user = await UserModel.findFirst({
    where: {
      id: id,
    },
  });

  return user;
};

export const findUserByUsername = async (username: string) => {
  const user = await UserModel.findFirst({
    where: {
      username: username,
    },
    include: {
      userLevel: true,
    },
  });

  return user;
};

export type UserData = {
  username: string;
  password: string;
  employeeId: number;
  userLevelId: number;
};

export type UserResource = {
  id: number;
  username: string;
  userLevelId: number;
  userLevel: string;
  employee: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export default UserModel;

export type UserResult = User;
