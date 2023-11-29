import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // userLevel
  const userLevel1 = await prisma.userLevel.upsert({
    where: { id: 1 },
    update: {},
    create: { level: 'admin' },
  });

  const userLevel2 = await prisma.userLevel.upsert({
    where: { id: 2 },
    update: {},
    create: { level: 'user' },
  });

  const userLevel3 = await prisma.userLevel.upsert({
    where: { id: 3 },
    update: {},
    create: { level: 'operator' },
  });

  // instruction
  const insctruction1 = await prisma.instruction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      instruction: 'DIKETAHUI',
    },
  });

  const insctruction2 = await prisma.instruction.upsert({
    where: { id: 2 },
    update: {},
    create: {
      instruction: 'PENDAPAT / SARAN',
    },
  });

  const insctruction3 = await prisma.instruction.upsert({
    where: { id: 3 },
    update: {},
    create: {
      instruction: 'BICARA / LAPOR',
    },
  });

  const insctruction4 = await prisma.instruction.upsert({
    where: { id: 4 },
    update: {},
    create: {
      instruction: 'DIKAJI / PELAJARI',
    },
  });

  const insctruction5 = await prisma.instruction.upsert({
    where: { id: 5 },
    update: {},
    create: {
      instruction: 'DITELITI',
    },
  });

  const insctruction6 = await prisma.instruction.upsert({
    where: { id: 6 },
    update: {},
    create: {
      instruction: 'DILAKSANAKAN',
    },
  });

  const insctruction7 = await prisma.instruction.upsert({
    where: { id: 7 },
    update: {},
    create: {
      instruction: 'DIPROSES',
    },
  });

  const insctruction8 = await prisma.instruction.upsert({
    where: { id: 8 },
    update: {},
    create: {
      instruction: 'DIJAWAB',
    },
  });

  const insctruction9 = await prisma.instruction.upsert({
    where: { id: 9 },
    update: {},
    create: {
      instruction: 'DIPEDOMANI',
    },
  });

  const insctruction10 = await prisma.instruction.upsert({
    where: { id: 10 },
    update: {},
    create: {
      instruction: 'DIUMUMKAN',
    },
  });

  const insctruction11 = await prisma.instruction.upsert({
    where: { id: 11 },
    update: {},
    create: {
      instruction: 'DIMONITOR',
    },
  });

  // status
  const status1 = await prisma.status.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Diproses',
    },
  });

  const status2 = await prisma.status.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Ditindaklanjuti',
    },
  });

  const status3 = await prisma.status.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Diarsipkan',
    },
  });

  // employee
  const employee = await prisma.employee.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'KASUBAG UMUM & KEPEGAWAIAN',
      position: 'KASUBAG UMUM & KEPEGAWAIAN',
      section: 'Sub Bagian Umum dan Pegawai',
    },
  });

  // user
  const password = await hash('pass123', 12);
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'Admin',
      password,
      userLevelId: 1,
      employeeId: 1,
    },
  });

  console.log({
    userLevel1,
    userLevel2,
    userLevel3,
    insctruction1,
    insctruction2,
    insctruction3,
    insctruction4,
    insctruction5,
    insctruction6,
    insctruction7,
    insctruction8,
    insctruction9,
    insctruction10,
    insctruction11,
    status1,
    status2,
    status3,
    employee,
    user,
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
