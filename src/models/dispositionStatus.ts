import { DispositionStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DispositionStatusModel: PrismaClient['dispositionStatus'] =
  prisma.dispositionStatus;

export default DispositionStatusModel;

export type DispositionStatusResult = DispositionStatus;
