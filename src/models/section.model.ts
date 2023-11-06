import { Section, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SectionModel: PrismaClient['section'] = prisma.section;

export default SectionModel;

export type SectionResult = Section;
