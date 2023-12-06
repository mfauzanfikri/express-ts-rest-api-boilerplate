import { Disposition, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DispositionModel: PrismaClient['disposition'] = prisma.disposition;

export type DispositionData = {
  from: number;
  to: number;
  notes: string | null;
  instructionId: number;
  incomingLetterId: number;
};

export type DispositionResource = {
  id: number;
  from: string;
  to: string;
  notes: string | null;
  instruction: string;
  incomingLetter: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type DispositionResult = Disposition;

export default DispositionModel;
