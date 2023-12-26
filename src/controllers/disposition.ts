import { NextFunction, Request, Response } from 'express';
import DispositionModel, {
  DispositionResult,
  DispositionData,
  DispositionResource,
} from '../models/disposition';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = DispositionModel;

const DispositionController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let getDispositions;
    try {
      getDispositions = await model.findMany({
        include: {
          dispositionStatus: true,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    let dispositions: DispositionResource[] = [];

    getDispositions.map((disposition) => {
      const obj: DispositionResource = {
        id: disposition.id,
        incomingLetter: `${process.env.BASE_URL}/incoming_letters/${disposition.incomingLetterId}`,
        status: disposition.dispositionStatus.name,
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

    let getDisposition;
    try {
      getDisposition = await model.findFirst({
        where: { id },
        include: {
          dispositionStatus: true,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!getDisposition) {
      const err: ErrorResponse = {
        status: 404,
        message: 'disposition not found',
      };

      return next(err);
    }

    const disposition: DispositionResource = {
      id: getDisposition.id,
      incomingLetter: `${process.env.BASE_URL}/incoming_letters/${getDisposition.incomingLetterId}`,
      status: getDisposition.dispositionStatus.name,
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

    if (!data.incomingLetterId || !data.dispositionStatusId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'incomingLetterId and dispositionStatusId parameters required',
      };

      return next(err);
    }

    let isExist;
    try {
      isExist = await model.findFirst({
        where: {
          incomingLetterId: data.incomingLetterId,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (isExist) {
      const err: ErrorResponse = {
        status: 409,
        message: 'disposition already exists',
      };

      return next(err);
    }

    try {
      const createdDisposition = await model.create({
        data: {
          incomingLetterId: data.incomingLetterId,
          dispositionStatusId: data.dispositionStatusId,
        },
        include: {
          dispositionStatus: true,
        },
      });

      const resData: DispositionResource = {
        id: createdDisposition.id,
        status: createdDisposition.dispositionStatus.name,
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
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);
    const data: DispositionData = req.body.data;

    if (!dispositionId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'dispositionId required',
      };

      return next(err);
    }

    if (!data.incomingLetterId && !data.dispositionStatusId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'incomingLetterId or dispositionStatusId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (key !== 'incomingLetterId' && key !== 'dispositionStatusId') {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: DispositionResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          incomingLetterId: data.incomingLetterId,
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
          dispositionStatus: true,
        },
      });

      const resData: DispositionResource = {
        id: updatedDisposition.id,
        incomingLetter: `${process.env.BASE_URL}/incoming_letters/${updatedDisposition.incomingLetterId}`,
        status: updatedDisposition.dispositionStatus.name,
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
        message: 'disposition does not exist',
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
        message: 'disposition deleted',
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
