import { NextFunction, Request, Response } from 'express';
import DispositionModel, {
  DispositionResult,
  DispositionData,
  DispositionResource,
} from '../models/disposition';
import IncomingLetterModel, {
  IncomingLetterResult,
  IncomingLetterData,
  IncomingLetterResource,
} from '../models/incomingLetter';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = DispositionModel;

const DispositionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const getDispositions = await model.findMany({
      include: {
        instruction: true,
      },
    });

    let dispositions: DispositionResource[] = [];

    getDispositions.map((disposition) => {
      const obj: DispositionResource = {
        id: disposition.id,
        from: `${process.env.BASE_URL}/users/${disposition.from}`,
        to: `${process.env.BASE_URL}/users/${disposition.to}`,
        instruction: disposition.instruction.instruction,
        notes: disposition.notes,
        incomingLetter: `${process.env.BASE_URL}/incoming_letters/${disposition.incomingLetterId}`,
        createdAt: disposition.createdAt,
        updatedAt: disposition.updatedAt,
      };
      dispositions.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      message: 'dispositions data fetched successfully',
      data: dispositions,
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

    const getDisposition = await model.findFirst({
      where: { id },
      include: {
        instruction: true,
      },
    });

    if (!getDisposition) {
      const err: ErrorResponse = {
        status: 404,
        message: 'disposition not found',
      };

      return next(err);
    }

    const disposition: DispositionResource = {
      id: getDisposition.id,
      from: `${process.env.BASE_URL}/users/${getDisposition.from}`,
      to: `${process.env.BASE_URL}/users/${getDisposition.to}`,
      instruction: getDisposition.instruction.instruction,
      notes: getDisposition.notes,
      incomingLetter: `${process.env.BASE_URL}/incoming_letters/${getDisposition.incomingLetterId}`,
      createdAt: getDisposition.createdAt,
      updatedAt: getDisposition.updatedAt,
    };

    const response: SuccessResponse = {
      success: true,
      message: 'disposition data fetched successfully',
      data: disposition,
    };

    res.json(response);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: DispositionData = JSON.parse(req.body.data);

    if (
      !req.file ||
      !data.from ||
      !data.to ||
      !data.instructionId ||
      !data.notes ||
      !data.incomingLetterId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'from, to, instructionId, notes, and incomingLetterId parameters required',
      };

      return next(err);
    }

    const isExist = await model.findFirst({
      where: {
        from: data.from,
      },
    });

    if (isExist) {
      const err: ErrorResponse = {
        status: 409,
        message: 'incomingLetter already exists',
      };

      return next(err);
    }

    try {
      const createdDisposition = await model.create({
        data: {
          from: data.from,
          to: data.to,
          instructionId: data.instructionId,
          notes: data.notes,
          incomingLetterId: data.incomingLetterId,
        },
        include: {
          instruction: true,
        },
      });

      const resData: DispositionResource = {
        id: createdDisposition.id,
        from: `${process.env.BASE_URL}/users/${createdDisposition.from}`,
        to: `${process.env.BASE_URL}/users/${createdDisposition.to}`,
        instruction: createdDisposition.instruction.instruction,
        notes: createdDisposition.notes,
        incomingLetter: `${process.env.BASE_URL}/incoming_letters/${createdDisposition.incomingLetterId}`,
        createdAt: createdDisposition.createdAt,
        updatedAt: createdDisposition.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'disposition created',
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
    const dispositionId: number =
      typeof req.body.dispositionId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.dispositionId);
    const data: DispositionData = JSON.parse(req.body.data);

    if (!dispositionId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'dispositionId required',
      };

      return next(err);
    }

    if (
      !data.from &&
      !data.to &&
      !data.instructionId &&
      !data.notes &&
      !data.incomingLetterId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'from, to, instructionId, notes or incomingLetterId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'from' &&
        key !== 'to' &&
        key !== 'instructionId' &&
        key !== 'notes' &&
        key !== 'incomingLetterId'
      ) {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: DispositionResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          from: data.from,
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
      const updatedDisposition = await model.update({
        where: { id: dispositionId },
        data: updateData,
        include: {
          instruction: true,
        },
      });

      const resData: DispositionResource = {
        id: updatedDisposition.id,
        from: `${process.env.BASE_URL}/users/${updatedDisposition.from}`,
        to: `${process.env.BASE_URL}/users/${updatedDisposition.to}`,
        instruction: updatedDisposition.instruction.instruction,
        notes: updatedDisposition.notes,
        incomingLetter: `${process.env.BASE_URL}/incoming_letters/${updatedDisposition.incomingLetterId}`,
        createdAt: updatedDisposition.createdAt,
        updatedAt: updatedDisposition.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 200,
        message: 'disposition updated',
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
    const dispositionId: number =
      typeof req.body.dispositionId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.dispositionId);

    if (!dispositionId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'dispositionId required',
      };

      return next(err);
    }

    let isExist: DispositionResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: dispositionId,
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
        message: 'incomingLetter does not exist',
      };

      return next(err);
    }

    try {
      await model.delete({
        where: {
          id: dispositionId,
        },
      });

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'incomingLetter deleted',
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

export default DispositionController;
