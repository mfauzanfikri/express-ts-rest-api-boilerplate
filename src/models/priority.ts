import { Priority, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PriorityModel: PrismaClient['priority'] = prisma.priority;

export default PriorityModel;

export type PriorityResult = Priority;
