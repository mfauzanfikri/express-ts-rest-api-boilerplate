import { OutgoingLetter, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const OutgoingLetterModel: PrismaClient['outgoingLetter'] =
  prisma.outgoingLetter;

export type OutgoingLetterData = {
  refNo: string;
  to: string;
  about: string;
  statusId: number;
};

export type OutgoingLetterResource = {
  id: number;
  refNo: string;
  to: string;
  about: string;
  status: String;
  path: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type OutgoingLetterResult = OutgoingLetter;

export default OutgoingLetterModel;
