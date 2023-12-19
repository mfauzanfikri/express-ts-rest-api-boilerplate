import { IncomingLetter, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const IncomingLetterModel: PrismaClient['incomingLetter'] =
  prisma.incomingLetter;

export type IncomingLetterData = {
  refNo: string;
  sender: string;
  about: string;
  date: Date;
  statusId: number;
};

export type IncomingLetterResource = {
  id: number;
  refNo: string;
  sender: string;
  about: string;
  date: Date;
  status: String;
  path: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type IncomingLetterResult = IncomingLetter;

export default IncomingLetterModel;
