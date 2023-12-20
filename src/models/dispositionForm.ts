import { DispositionForm, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DispositionFormModel: PrismaClient['dispositionForm'] =
  prisma.dispositionForm;

export type DispositionFormData = {
  from: number;
  to: number;
  notes: string | null;
  dispositionId: number;
  instructionId: number;
};

export type DispositionFormResource = {
  id: number;
  from: string;
  to: string;
  notes: string | null;
  instruction: string;
  disposition: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export type DispositionFormResult = DispositionForm;

export default DispositionFormModel;
