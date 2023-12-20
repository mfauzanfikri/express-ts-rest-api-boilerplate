import { Disposition, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DispositionModel: PrismaClient['disposition'] = prisma.disposition;

export type DispositionData = {
  incomingLetterId: number;
  dispositionStatusId: number;
};

export type DispositionResource = {
  id: number;
  incomingLetter: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type DispositionResult = Disposition;

export default DispositionModel;
