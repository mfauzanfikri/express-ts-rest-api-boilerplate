import { DispositionForm, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DispositionFormModel: PrismaClient['dispositionForm'] =
  prisma.dispositionForm;

export default DispositionFormModel;

export type DispositionFormResult = DispositionForm;
