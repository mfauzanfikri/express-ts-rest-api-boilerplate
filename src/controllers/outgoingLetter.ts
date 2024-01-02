import { NextFunction, Request, Response } from 'express';
import OutgoingLetterModel, {
  OutgoingLetterResult,
  OutgoingLetterData,
  OutgoingLetterResource,
} from '../models/outgoingLetter';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import { readFileSync } from 'fs';
import pathModule from 'path';

const model = OutgoingLetterModel;

const OutgoingLetterController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let getOutgoingLetters;
    try {
      getOutgoingLetters = await model.findMany({
        include: {
          status: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    let outgoingLetters: any = [];

    getOutgoingLetters.map((outgoingLetter) => {
      const obj: OutgoingLetterResource = {
        id: outgoingLetter.id,
        refNo: outgoingLetter.refNo,
        to: outgoingLetter.to,
        about: outgoingLetter.about,
        status: outgoingLetter.status.name,
        date: outgoingLetter.date,
        path: `${process.env.BASE_URL}/outgoind_letters/file/${outgoingLetter.id}`,
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
      date: getOutgoingLetter.date,
      path: `${process.env.BASE_URL}/outgoind_letters/file/${getOutgoingLetter.id}`,
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

  getFile: async (req: Request, res: Response, next: NextFunction) => {
    const id = Number.parseInt(req.params.id);

    if (!id) {
      const err: ErrorResponse = {
        status: 422,
        message: 'id parameter required',
      };

      return next(err);
    }

    const outgoingLetter = await model.findFirst({
      where: { id },
      select: { path: true },
    });

    if (!outgoingLetter) {
      const err: ErrorResponse = {
        status: 404,
        message: 'outgoingLetter not found',
      };

      return next(err);
    }

    const path = outgoingLetter.path;

    if (!path) {
      const err: ErrorResponse = {
        status: 404,
        message: 'outgoingLetter exists, but the file does not exist',
      };

      return next(err);
    }

    try {
      readFileSync(path);
    } catch (error) {
      const err: ErrorResponse = {
        status: 404,
        message: 'outgoingLetter exists, but the file does not exist',
      };

      return next(err);
    }

    res.sendFile(path);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    const data: OutgoingLetterData = req.body.data;

    if (
      !req.file ||
      !data.refNo ||
      !data.to ||
      !data.about ||
      !data.date ||
      !data.statusId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, to, about, date, and statusId parameters required',
      };

      return next(err);
    }

    let isExist;
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

    if (isExist) {
      const err: ErrorResponse = {
        status: 409,
        message: 'outgoing letter already exists',
      };

      return next(err);
    }

    try {
      const createdOutgoingLetter = await model.create({
        data: {
          refNo: data.refNo,
          to: data.to,
          about: data.about,
          date: data.date,
          statusId: data.statusId,
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
        date: createdOutgoingLetter.date,
        path: `${process.env.BASE_URL}/outgoind_letters/file/${createdOutgoingLetter.id}`,
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

  postFile: async (req: Request, res: Response, next: NextFunction) => {
    const id: number =
      typeof req.body.id === 'string'
        ? Number.parseInt(req.body.id)
        : typeof req.body.id === 'number' && req.body.id;
    const file = req.file;

    if (!file || !id) {
      const err: ErrorResponse = {
        status: 422,
        message: 'file or id field missing',
      };

      if (file && !id) {
        unlinkSync(file.path);
      }

      return next(err);
    }

    if (file.mimetype !== 'application/pdf') {
      const err: ErrorResponse = {
        status: 415,
        message: 'only pdf file is acceptable for incomingLetter field',
      };

      unlinkSync(file.path);

      return next(err);
    }

    const path = pathModule.join(__dirname, '../../' + file.path);

    try {
      await model.update({
        where: { id },
        data: { path },
      });
    } catch (error) {
      const err: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(err);
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: 'file saved',
    };

    res.json(successResponse);
  },

  put: async (req: Request, res: Response, next: NextFunction) => {
    const outgoingLetterId: number =
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);
    const data: OutgoingLetterData = req.body.data;

    if (!outgoingLetterId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'outgoingLetterId required',
      };

      return next(err);
    }

    if (
      !req.file &&
      !data.refNo &&
      !data.to &&
      !data.about &&
      !data.date &&
      !data.statusId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, to, about, date, or statusId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'refNo' &&
        key !== 'to' &&
        key !== 'about' &&
        key !== 'date' &&
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
        date: updatedOutgoingLetter.date,
        path: `${process.env.BASE_URL}/outgoind_letters/file/${updatedOutgoingLetter.id}`,
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
function unlinkSync(path: string) {
  throw new Error('Function not implemented.');
}
