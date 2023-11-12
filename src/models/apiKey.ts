import { ApiKey, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const APIKeyModel: PrismaClient['apiKey'] = prisma.apiKey;

export default APIKeyModel;

export type APIKeyResult = ApiKey;
