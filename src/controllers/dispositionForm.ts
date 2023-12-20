import { NextFunction, Request, Response } from 'express';
import DispositionFormFormModel, {
  DispositionFormResult,
  DispositionFormData,
  DispositionFormResource,
} from '../models/dispositionForm';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = DispositionFormFormModel;

const DispositionFormController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let getDispositionForms;
    try {
      getDispositionForms = await model.findMany({
        include: {
          instruction: true,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    let dispositionForms: DispositionFormResource[] = [];

    getDispositionForms.map((dispositionForm) => {
      const obj: DispositionFormResource = {
        id: dispositionForm.id,
        from: `${process.env.BASE_URL}/users/${dispositionForm.from}`,
        to: `${process.env.BASE_URL}/users/${dispositionForm.to}`,
        instruction: dispositionForm.instruction.name,
        notes: dispositionForm.notes,
        disposition: `${process.env.BASE_URL}/dispositions/${dispositionForm.dispositionId}`,
        createdAt: dispositionForm.createdAt,
        updatedAt: dispositionForm.updatedAt,
      };
      dispositionForms.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      message: 'dispositionForms data fetched successfully',
      data: dispositionForms,
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

    let getDispositionForm;
    try {
      getDispositionForm = await model.findFirst({
        where: { id },
        include: { instruction: true },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!getDispositionForm) {
      const err: ErrorResponse = {
        status: 404,
        message: 'disposition not found',
      };

      return next(err);
    }

    const disposition: DispositionFormResource = {
      id: getDispositionForm.id,
      from: `${process.env.BASE_URL}/users/${getDispositionForm.from}`,
      to: `${process.env.BASE_URL}/users/${getDispositionForm.to}`,
      instruction: getDispositionForm.instruction.name,
      notes: getDispositionForm.notes,
      disposition: `${process.env.BASE_URL}/dispositions/${getDispositionForm.dispositionId}`,
      createdAt: getDispositionForm.createdAt,
      updatedAt: getDispositionForm.updatedAt,
    };

    const response: SuccessResponse = {
      success: true,
      message: 'dispositionForm data fetched successfully',
      data: disposition,
    };

    res.json(response);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: DispositionFormData = JSON.parse(req.body.data);

    if (
      !data.from ||
      !data.to ||
      !data.notes ||
      !data.instructionId ||
      !data.dispositionId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'from, to, notes, instructionId, and dispositionId parameters required',
      };

      return next(err);
    }

    try {
      const createdDispositionForm = await model.create({
        data: {
          from: data.from,
          to: data.to,
          notes: data.notes,
          instructionId: data.instructionId,
          dispositionId: data.dispositionId,
        },
        include: { instruction: true },
      });

      const resData: DispositionFormResource = {
        id: createdDispositionForm.id,
        from: `${process.env.BASE_URL}/users/${createdDispositionForm.from}`,
        to: `${process.env.BASE_URL}/users/${createdDispositionForm.to}`,
        instruction: createdDispositionForm.instruction.name,
        notes: createdDispositionForm.notes,
        disposition: `${process.env.BASE_URL}/dispositions/${createdDispositionForm.dispositionId}`,
        createdAt: createdDispositionForm.createdAt,
        updatedAt: createdDispositionForm.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'dispositionForm created',
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
    const dispositionFormId: number =
      typeof req.body.dispositionFormId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.dispositionFormId);
    const data: DispositionFormData = JSON.parse(req.body.data);

    if (!dispositionFormId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'dispositionFormId required',
      };

      return next(err);
    }

    if (
      !data.from &&
      !data.to &&
      !data.notes &&
      !data.instructionId &&
      !data.dispositionId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'from, to, notes, instructionId, or dispositionId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'from' &&
        key !== 'to' &&
        key !== 'notes' &&
        key !== 'instructionId' &&
        key !== 'dispositionId'
      ) {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: DispositionFormResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: dispositionFormId,
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
        message: 'disposition does not exist',
      };

      return next(err);
    }

    try {
      const updatedDispositionForm = await model.update({
        where: { id: dispositionFormId },
        data: updateData,
        include: {
          instruction: true,
        },
      });

      const resData: DispositionFormResource = {
        id: updatedDispositionForm.id,
        from: `${process.env.BASE_URL}/users/${updatedDispositionForm.from}`,
        to: `${process.env.BASE_URL}/users/${updatedDispositionForm.to}`,
        instruction: updatedDispositionForm.instruction.name,
        notes: updatedDispositionForm.notes,
        disposition: `${process.env.BASE_URL}/dispositions/${updatedDispositionForm.dispositionId}`,
        createdAt: updatedDispositionForm.createdAt,
        updatedAt: updatedDispositionForm.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 200,
        message: 'dispositionForm updated',
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
    const dispositionFormId: number =
      typeof req.body.dispositionFormId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.dispositionFormId);

    if (!dispositionFormId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'dispositionFormId required',
      };

      return next(err);
    }

    let isExist: DispositionFormResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: dispositionFormId,
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
        message: 'dispositionForm does not exist',
      };

      return next(err);
    }

    try {
      await model.delete({
        where: {
          id: dispositionFormId,
        },
      });

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'dispositionForm deleted',
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

export default DispositionFormController;
