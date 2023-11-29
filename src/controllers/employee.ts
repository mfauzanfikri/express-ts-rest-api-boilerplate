import { NextFunction, Request, Response } from 'express';
import EmployeeModel, { EmployeeResult } from '../models/employee';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = EmployeeModel;

type EmployeeData = {
  name: string;
  nip?: string;
  nik?: string;
  section: string;
  position: string;
};

type EmployeeResource = {
  id: number;
  name: string;
  nip: string | null;
  nik: string | null;
  section: string;
  position: string;
  createdAt: Date;
  updatedAt: Date | null;
};

const EmployeeController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const getEmployees = await model.findMany();

    let employees: any = [];

    getEmployees.map((employee) => {
      const obj: EmployeeResource = {
        id: employee.id,
        name: employee.name,
        nip: employee.nip,
        nik: employee.nik,
        section: employee.section,
        position: employee.position,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      };
      employees.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      message: 'employees data fetched successfully',
      data: employees,
    };

    res.json(response);
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id);

    if (!id) {
      const err: ErrorResponse = {
        status: 422,
        message: 'id parameter required',
      };

      return next(err);
    }

    const getEmployee = await model.findFirst({
      where: { id },
    });

    if (!getEmployee) {
      const err: ErrorResponse = {
        status: 404,
        message: 'employee not found',
      };

      return next(err);
    }

    const employee: EmployeeResource = {
      id: getEmployee.id,
      name: getEmployee.name,
      nip: getEmployee.nip,
      nik: getEmployee.nik,
      section: getEmployee.section,
      position: getEmployee.position,
      createdAt: getEmployee.createdAt,
      updatedAt: getEmployee.updatedAt,
    };

    const response: SuccessResponse = {
      success: true,
      message: 'employee data fetched successfully',
      data: employee,
    };

    res.json(response);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: EmployeeData = JSON.parse(req.body.data);
    console.log(data);

    if (
      !data.name ||
      (!data.nip && !data.nik) ||
      !data.section ||
      !data.position
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'name, nip/nik, section, and position parameters required',
      };

      return next(err);
    }

    let isExist;
    if (data.nip) {
      isExist = await model.findFirst({
        where: {
          nip: data.nip,
        },
      });
    } else {
      isExist = await model.findFirst({
        where: {
          nik: data.nik,
        },
      });
    }

    if (isExist) {
      const err: ErrorResponse = {
        status: 409,
        message: 'employee already exists',
      };

      return next(err);
    }

    try {
      const createdEmployee = await model.create({
        data: {
          name: data.name,
          nip: data.nip ? data.nip : null,
          nik: data.nik ? data.nik : null,
          section: data.section,
          position: data.position,
        },
      });

      const resData: EmployeeResource = {
        id: createdEmployee.id,
        name: createdEmployee.name,
        nip: createdEmployee.nip,
        nik: createdEmployee.nik,
        section: createdEmployee.section,
        position: createdEmployee.position,
        createdAt: createdEmployee.createdAt,
        updatedAt: createdEmployee.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'employee created',
        data: resData,
      };

      res.json(response);
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }
  },

  put: async (req: Request, res: Response, next: NextFunction) => {
    const employeeId: number =
      typeof req.body.employeeId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.employeeId);
    const data: EmployeeData = JSON.parse(req.body.data);

    if (!employeeId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'employeeId required',
      };

      return next(err);
    }

    if (
      !data.name ||
      (!data.nip && !data.nik) ||
      !data.section ||
      !data.position
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'name, nip, section, or position parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'name' &&
        key !== 'nip' &&
        key !== 'nik' &&
        key !== 'section' &&
        key !== 'position'
      ) {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: EmployeeResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          nip: data.nip,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!isExist) {
      const err: ErrorResponse = {
        status: 404,
        message: 'employee does not exist',
      };

      return next(err);
    }

    try {
      const updatedEmployee = await model.update({
        where: { id: employeeId },
        data: updateData,
      });

      const resData: EmployeeResource = {
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        nip: updatedEmployee.nip,
        nik: updatedEmployee.nik,
        section: updatedEmployee.section,
        position: updatedEmployee.position,
        createdAt: updatedEmployee.createdAt,
        updatedAt: updatedEmployee.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 200,
        message: 'employee updated',
        data: resData,
      };

      res.json(response);
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    const employeeId: number =
      typeof req.body.employeeId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.employeeId);

    if (!employeeId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'employeeId required',
      };

      return next(err);
    }

    let isExist: EmployeeResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: employeeId,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!isExist) {
      const err: ErrorResponse = {
        status: 404,
        message: 'employee does not exist',
      };

      return next(err);
    }

    try {
      await model.delete({
        where: {
          id: employeeId,
        },
      });

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'employee deleted',
      };

      res.json(response);
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }
  },
};

export default EmployeeController;
