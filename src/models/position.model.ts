import { Position, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PositionModel: PrismaClient['position'] = prisma.position;

export default PositionModel;

export type PositionResult = Position;
