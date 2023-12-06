import { Employee, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const EmployeeModel: PrismaClient['employee'] = prisma.employee;

export type EmployeeData = {
  name: string;
  nip?: string;
  nik?: string;
  sectionId: number;
  position: string;
};

export type EmployeeResource = {
  id: number;
  name: string;
  nip: string | null;
  nik: string | null;
  section: string;
  position: string;
  createdAt: Date;
  updatedAt: Date | null;
};

export default EmployeeModel;

export type EmployeeResult = Employee;
