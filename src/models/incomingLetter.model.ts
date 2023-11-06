import { IncomingLetter, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const IncomingLetterModel: PrismaClient['incomingLetter'] =
  prisma.incomingLetter;

export default IncomingLetterModel;

export type IncomingLetterResult = IncomingLetter;
