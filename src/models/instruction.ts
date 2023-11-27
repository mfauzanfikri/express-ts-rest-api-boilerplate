import { Instruction, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const InstructionModel: PrismaClient['instruction'] = prisma.instruction;

export default InstructionModel;

export type InstructionResult = Instruction;
