import { Employee, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const EmployeeModel: PrismaClient['employee'] = prisma.employee;

export default EmployeeModel;

export type EmployeeResult = Employee;
