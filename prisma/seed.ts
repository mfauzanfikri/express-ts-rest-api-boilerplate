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
    create: { level: 'petinggi' },
  });

  const userLevel3 = await prisma.userLevel.upsert({
    where: { id: 3 },
    update: {},
    create: { level: 'operator petinggi' },
  });
  const userLevel4 = await prisma.userLevel.upsert({
    where: { id: 4 },
    update: {},
    create: { level: 'operator' },
  });

  // instruction
  const insctruction1 = await prisma.instruction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'DIKETAHUI',
    },
  });

  const insctruction2 = await prisma.instruction.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'PENDAPAT / SARAN',
    },
  });

  const insctruction3 = await prisma.instruction.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'BICARA / LAPOR',
    },
  });

  const insctruction4 = await prisma.instruction.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'DIKAJI / PELAJARI',
    },
  });

  const insctruction5 = await prisma.instruction.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'DITELITI',
    },
  });

  const insctruction6 = await prisma.instruction.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'DILAKSANAKAN',
    },
  });

  const insctruction7 = await prisma.instruction.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'DIPROSES',
    },
  });

  const insctruction8 = await prisma.instruction.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'DIJAWAB',
    },
  });

  const insctruction9 = await prisma.instruction.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: 'DIPEDOMANI',
    },
  });

  const insctruction10 = await prisma.instruction.upsert({
    where: { id: 10 },
    update: {},
    create: {
      name: 'DIUMUMKAN',
    },
  });

  const insctruction11 = await prisma.instruction.upsert({
    where: { id: 11 },
    update: {},
    create: {
      name: 'DIMONITOR',
    },
  });

  // status
  const status1 = await prisma.status.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'terbuka',
    },
  });

  const status2 = await prisma.status.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'disposisi',
    },
  });

  const status3 = await prisma.status.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'ditindaklanjuti',
    },
  });

  const status4 = await prisma.status.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'diarsipkan',
    },
  });

  // section
  const section1 = await prisma.section.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Inspektur',
    },
  });

  const section2 = await prisma.section.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Inspektur Pembantu I',
    },
  });

  const section3 = await prisma.section.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Inspektur Pembantu II',
    },
  });

  const section4 = await prisma.section.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Inspektur Pembantu III',
    },
  });

  const section5 = await prisma.section.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: 'Inspektur Pembantu IV',
    },
  });

  const section6 = await prisma.section.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: 'Inspektur Pembantu Investigasi',
    },
  });

  const section7 = await prisma.section.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: 'Sekretaris',
    },
  });

  const section8 = await prisma.section.upsert({
    where: { id: 8 },
    update: {},
    create: {
      name: 'Sub Bagian Keuangan',
    },
  });

  const section9 = await prisma.section.upsert({
    where: { id: 9 },
    update: {},
    create: {
      name: 'Sub Bagian Umum dan Kepegawaian',
    },
  });

  // employee
  const employee = await prisma.employee.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'KASUBAG UMUM & KEPEGAWAIAN',
      position: 'KASUBAG UMUM & KEPEGAWAIAN',
      sectionId: 8,
    },
  });

  // user
  const password = await hash('pass123', 12);
  const user = await prisma.user.upsert({
    where: { username: 'Admin' },
    update: {},
    create: {
      username: 'Admin',
      password,
      userLevelId: 1,
      employeeId: 1,
    },
  });

  // apikey
  const apikey1 = await prisma.apiKey.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'web-api-key',
      key: '9734c1467631214fbfeca38a95430c48cdbcb2871fc448ed4680fd2d3ac35ca970040b102161677d9f853b59b2914ef1',
    },
  });

  const apikey2 = await prisma.apiKey.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'mobile-api-key',
      key: '8a117240331c5f9d9e067299e3fd30a3317f4eee2801266090b08b195c6e569a158662ecdd8b2050818d0639b456b4b8',
    },
  });

  // incomingLetter
  const incomingLetter1 = await prisma.incomingLetter.upsert({
    where: { id: 1 },
    update: {},
    create: {
      refNo: '001',
      sender: 'A',
      about: 'Undangan',
      date: new Date(Date.now()),
      statusId: 1,
    },
  });

  const incomingLetter2 = await prisma.incomingLetter.upsert({
    where: { id: 2 },
    update: {},
    create: {
      refNo: '002',
      sender: 'B',
      about: 'Surat Dinas',
      date: new Date(Date.now() - 100000000000),
      statusId: 1,
    },
  });

  // outgoingLetter
  const outgoingLetter1 = await prisma.outgoingLetter.upsert({
    where: { id: 1 },
    update: {},
    create: {
      refNo: '001',
      to: 'A',
      about: 'Undangan',
      date: new Date(Date.now()),
      statusId: 1,
    },
  });

  const outgoingLetter2 = await prisma.outgoingLetter.upsert({
    where: { id: 2 },
    update: {},
    create: {
      refNo: '002',
      to: 'A',
      about: 'Surat Dinas',
      date: new Date(Date.now() - 100000000000),
      statusId: 1,
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
    section1,
    section2,
    section3,
    section4,
    section5,
    section6,
    section7,
    section8,
    section9,
    employee,
    user,
    apikey1,
    apikey2,
    incomingLetter1,
    incomingLetter2,
    outgoingLetter1,
    outgoingLetter2,
  });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
