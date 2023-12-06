import { NextFunction, Request, Response } from 'express';
import IncomingLetterModel, {
  IncomingLetterResult,
  IncomingLetterData,
  IncomingLetterResource,
} from '../models/incomingLetter';
import { ErrorResponse, SuccessResponse } from '../types/responses';

const model = IncomingLetterModel;

const IncomingLetterController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const getIncomingLetters = await model.findMany({
      include: {
        status: true,
      },
    });

    let incomingLetters: any = [];

    getIncomingLetters.map((incomingLetter) => {
      const obj: IncomingLetterResource = {
        id: incomingLetter.id,
        refNo: incomingLetter.refNo,
        sender: incomingLetter.sender,
        about: incomingLetter.about,
        status: incomingLetter.status.name,
        path: incomingLetter.path,
        createdAt: incomingLetter.createdAt,
        updatedAt: incomingLetter.updatedAt,
      };
      incomingLetters.push(obj);
    });

    const response: SuccessResponse = {
      success: true,
      message: 'incomingLetters data fetched successfully',
      data: incomingLetters,
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

    const getIncomingLetter = await model.findFirst({
      where: { id },
      include: {
        status: true,
      },
    });

    if (!getIncomingLetter) {
      const err: ErrorResponse = {
        status: 404,
        message: 'incomingLetter not found',
      };

      return next(err);
    }

    const incomingLetter: IncomingLetterResource = {
      id: getIncomingLetter.id,
      refNo: getIncomingLetter.refNo,
      sender: getIncomingLetter.sender,
      about: getIncomingLetter.about,
      status: getIncomingLetter.status.name,
      path: getIncomingLetter.path,
      createdAt: getIncomingLetter.createdAt,
      updatedAt: getIncomingLetter.updatedAt,
    };

    const response: SuccessResponse = {
      success: true,
      message: 'incomingLetter data fetched successfully',
      data: incomingLetter,
    };

    res.json(response);
  },

  getFile: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id);

    if (!id) {
      const err: ErrorResponse = {
        status: 422,
        message: 'id parameter required',
      };

      return next(err);
    }
    const incomingLetter = await model.findFirst({
      where: { id },
      select: { path: true },
    });

    if (!incomingLetter) {
      const err: ErrorResponse = {
        status: 404,
        message: 'incomingLetter not found',
      };

      return next(err);
    }

    res.sendFile(incomingLetter.path);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: IncomingLetterData = JSON.parse(req.body.data);

    if (
      !req.file ||
      !data.refNo ||
      !data.sender ||
      !data.about ||
      !data.statusId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, sender, about, and statusId parameters required',
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
        message: 'incoming letter already exists',
      };

      return next(err);
    }

    const originalPath = req.file?.path.replace(/\\/g, '/')!;
    const path =
      process.env.BASE_URL +
      '/' +
      originalPath.substring(originalPath.indexOf('/') + 1);

    try {
      const createdIncomingLetter = await model.create({
        data: {
          refNo: data.refNo,
          sender: data.sender,
          about: data.about,
          statusId: data.statusId,
          path,
        },
        include: {
          status: true,
        },
      });

      const resData: IncomingLetterResource = {
        id: createdIncomingLetter.id,
        refNo: createdIncomingLetter.refNo,
        sender: createdIncomingLetter.sender,
        about: createdIncomingLetter.about,
        status: createdIncomingLetter.status.name,
        path: createdIncomingLetter.path,
        createdAt: createdIncomingLetter.createdAt,
        updatedAt: createdIncomingLetter.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 201,
        message: 'incomingLetter created',
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
    const incomingLetterId: number =
      typeof req.body.incomingLetterId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.incomingLetterId);
    const data: IncomingLetterData = JSON.parse(req.body.data);

    if (!incomingLetterId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'incomingLetterId required',
      };

      return next(err);
    }

    if (
      !req.file &&
      !data.refNo &&
      !data.sender &&
      !data.about &&
      !data.statusId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, sender, about, or statusId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'refNo' &&
        key !== 'sender' &&
        key !== 'about' &&
        key !== 'statusId'
      ) {
        continue;
      }

      Object.assign(updateData, { [key]: data[key] });
    }

    let isExist: IncomingLetterResult | null = null;
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
        message: 'incomingLetter does not exist',
      };

      return next(err);
    }

    try {
      const updatedIncomingLetter = await model.update({
        where: { id: incomingLetterId },
        data: updateData,
        include: {
          status: true,
        },
      });

      const resData: IncomingLetterResource = {
        id: updatedIncomingLetter.id,
        refNo: updatedIncomingLetter.refNo,
        sender: updatedIncomingLetter.sender,
        about: updatedIncomingLetter.about,
        status: updatedIncomingLetter.status.name,
        path: updatedIncomingLetter.path,
        createdAt: updatedIncomingLetter.createdAt,
        updatedAt: updatedIncomingLetter.updatedAt,
      };

      const response: SuccessResponse = {
        success: true,
        status: 200,
        message: 'incomingLetter updated',
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
    const incomingLetterId: number =
      typeof req.body.incomingLetterId === 'number'
        ? req.body.id
        : Number.parseInt(req.body.incomingLetterId);

    if (!incomingLetterId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'incomingLetterId required',
      };

      return next(err);
    }

    let isExist: IncomingLetterResult | null = null;
    try {
      isExist = await model.findFirst({
        where: {
          id: incomingLetterId,
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
        message: 'incoming letter does not exist',
      };

      return next(err);
    }

    try {
      await model.delete({
        where: {
          id: incomingLetterId,
        },
      });

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'incoming letter deleted',
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

export default IncomingLetterController;
