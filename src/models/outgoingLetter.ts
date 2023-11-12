import { OutgoingLetter, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OutgoingLetterModel: PrismaClient['outgoingLetter'] =
  prisma.outgoingLetter;

export default OutgoingLetterModel;

export type OutgoingLetterResult = OutgoingLetter;
