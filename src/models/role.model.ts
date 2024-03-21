import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const RoleModel: PrismaClient['role'] = prisma.role;

export type RoleResult = Role;

export default RoleModel;
