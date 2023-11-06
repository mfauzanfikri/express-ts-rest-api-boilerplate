import { UserLevel, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const UserLevelModel: PrismaClient['userLevel'] = prisma.userLevel;

export default UserLevelModel;

export type UserLevelResult = UserLevel;
