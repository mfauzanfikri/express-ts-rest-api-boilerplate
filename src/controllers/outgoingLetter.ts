import { NextFunction, Request, Response } from 'express';
import OutgoingLetterModel, {
  OutgoingLetterResult,
  OutgoingLetterData,
  OutgoingLetterResource,
} from '../models/outgoingLetter';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = OutgoingLetterModel;

const OutgoingLetterController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const getOutgoingLetters = await model.findMany({
      include: {
        status: true,
      },
    });

    let outgoingLetters: any = [];

    getOutgoingLetters.map((outgoingLetter) => {
      const obj: OutgoingLetterResource = {
        id: outgoingLetter.id,
        refNo: outgoingLetter.refNo,
        to: outgoingLetter.to,
        about: outgoingLetter.about,
        status: outgoingLetter.status.name,
        path: outgoingLetter.path,
        createdAt: outgoingLetter.createdAt,
        updatedAt: outgoingLetter.updatedAt,
      };
      outgoingLetters.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      message: 'outgoingLetters data fetched successfully',
      data: outgoingLetters,
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

    const getOutgoingLetter = await model.findFirst({
      where: { id },
      include: {
        status: true,
      },
    });

    if (!getOutgoingLetter) {
      const err: ErrorResponse = {
        status: 404,
        message: 'outgoingLetter not found',
      };

      return next(err);
    }

    const outgoingLetter: OutgoingLetterResource = {
      id: getOutgoingLetter.id,
      refNo: getOutgoingLetter.refNo,
      to: getOutgoingLetter.to,
      about: getOutgoingLetter.about,
      status: getOutgoingLetter.status.name,
      path: getOutgoingLetter.path,
      createdAt: getOutgoingLetter.createdAt,
      updatedAt: getOutgoingLetter.updatedAt,
    };

    const response: SuccessResponse = {
      success: true,
      message: 'outgoingLetter data fetched successfully',
      data: outgoingLetter,
    };

    res.json(response);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: OutgoingLetterData = JSON.parse(req.body.data);

    if (!req.file || !data.refNo || !data.to || !data.about || !data.statusId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, to, about, and statusId parameters required',
      };

      return next(err);
    }

    const isExist = await model.findFirst({
      where: {
        refNo: data.refNo,
      },
    });

    if (isExist) {
      const err: ErrorResponse = {
        status: 409,
        message: 'outgoing letter already exists',
      };

      return next(err);
    }

    const originalPath = req.file?.path.replace(/\\/g, '/')!;
    const path =
      process.env.BASE_URL +
      '/' +
      originalPath.substring(originalPath.indexOf('/') + 1);

    try {
      const createdOutgoingLetter = await model.create({
        data: {
          refNo: data.refNo,
          to: data.to,
          about: data.about,
          statusId: data.statusId,
          path,
        },
        include: {
          status: true,
        },
      });

      const resData: OutgoingLetterResource = {
        id: createdOutgoingLetter.id,
        refNo: createdOutgoingLetter.refNo,
        to: createdOutgoingLetter.to,
        about: createdOutgoingLetter.about,
        status: createdOutgoingLetter.status.name,
        path: createdOutgoingLetter.path,
        createdAt: createdOutgoingLetter.createdAt,
        updatedAt: createdOutgoingLetter.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'outgoingLetter created',
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
    const outgoingLetterId: number =
      typeof req.body.outgoingLetterId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.outgoingLetterId);
    const data: OutgoingLetterData = JSON.parse(req.body.data);

    if (!outgoingLetterId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'outgoingLetterId required',
      };

      return next(err);
    }

    if (!req.file && !data.refNo && !data.to && !data.about && !data.statusId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, to, about, or statusId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'refNo' &&
        key !== 'to' &&
        key !== 'about' &&
        key !== 'statusId'
      ) {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: OutgoingLetterResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          refNo: data.refNo,
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
        message: 'outgoingLetter does not exist',
      };

      return next(err);
    }

    try {
      const updatedOutgoingLetter = await model.update({
        where: { id: outgoingLetterId },
        data: updateData,
        include: {
          status: true,
        },
      });

      const resData: OutgoingLetterResource = {
        id: updatedOutgoingLetter.id,
        refNo: updatedOutgoingLetter.refNo,
        to: updatedOutgoingLetter.to,
        about: updatedOutgoingLetter.about,
        status: updatedOutgoingLetter.status.name,
        path: updatedOutgoingLetter.path,
        createdAt: updatedOutgoingLetter.createdAt,
        updatedAt: updatedOutgoingLetter.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 200,
        message: 'outgoingLetter updated',
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
    const outgoingLetterId: number =
      typeof req.body.outgoingLetterId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.outgoingLetterId);

    if (!outgoingLetterId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'outgoingLetterId required',
      };

      return next(err);
    }

    let isExist: OutgoingLetterResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: outgoingLetterId,
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
        message: 'outgoing letter does not exist',
      };

      return next(err);
    }

    try {
      await model.delete({
        where: {
          id: outgoingLetterId,
        },
      });

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'outgoing letter deleted',
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

export default OutgoingLetterController;
