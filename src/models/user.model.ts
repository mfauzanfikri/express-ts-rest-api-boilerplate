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
  });

  return user;
};

export default UserModel;

export type UserResult = User;
