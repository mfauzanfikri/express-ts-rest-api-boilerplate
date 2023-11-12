import { generateApiKey as generator } from 'generate-api-key';
import { createCipheriv, createDecipheriv } from 'crypto';
import APIKeyModel, { APIKeyResult } from '../models/apiKey';

const algorithm = process.env.API_KEY_ALGORITHM as string;
const secretKey = process.env.API_KEY_SECRET as string;
const iv = process.env.API_KEY_IV as string;
const model = APIKeyModel;

export const generateApiKey = () => {
  const key = generator({
    method: 'uuidv5',
    name: 'Simurat API',
    batch: 1,
  }).toString();

  const hash = encryptKey(key);

  return { key, hash };
};

export const authKey = async (
  clientKey: string
): Promise<APIKeyResult | boolean> => {
  const key = await model.findFirst({
    where: {
      key: { equals: encryptKey(clientKey) },
    },
  });

  if (!key) {
    return false;
  }

  return key;
};

export const encryptKey = (key: string) => {
  const cipher = createCipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

  const encrypted = Buffer.concat([cipher.update(key), cipher.final()]);

  return encrypted.toString('hex');
};

export const decryptKey = (hash: string) => {
  const decipher = createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv, 'hex')
  );

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(hash, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString();
};

const apiService = { generateApiKey, authKey, encryptKey, decryptKey };

export default apiService;
