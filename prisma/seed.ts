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

  const employee = await prisma.employee.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Kasubag Umum dan Pegawai',
      position: 'Kasubag',
      section: 'Sub Bagian Umum dan Pegawai',
    },
  });

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
