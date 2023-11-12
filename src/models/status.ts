import { Status, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const StatusModel: PrismaClient['status'] = prisma.status;

export default StatusModel;

export type StatusResult = Status;
