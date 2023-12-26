import { NextFunction, Request, Response } from 'express';
import IncomingLetterModel, {
  IncomingLetterResult,
  IncomingLetterData,
  IncomingLetterResource,
} from '../models/incomingLetter';
import { ErrorResponse, SuccessResponse } from '../types/responses';
import { readFile, readFileSync, readSync, unlinkSync } from 'fs';
import pathModule from 'path';

const model = IncomingLetterModel;

const IncomingLetterController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    let getIncomingLetters;
    try {
      getIncomingLetters = await model.findMany({
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

    let incomingLetters: any = [];

    getIncomingLetters.map((incomingLetter) => {
      const obj: IncomingLetterResource = {
        id: incomingLetter.id,
        refNo: incomingLetter.refNo,
        sender: incomingLetter.sender,
        about: incomingLetter.about,
        status: incomingLetter.status.name,
        date: incomingLetter.date,
        path: !incomingLetter.path
          ? null
          : `${process.env.BASE_URL}/incoming_letters/file/${incomingLetter.id}`,
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

    let getIncomingLetter;
    try {
      getIncomingLetter = await model.findFirst({
        where: { id },
        include: {
          status: true,
        },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

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
      date: getIncomingLetter.date,
      path: !getIncomingLetter.path
        ? null
        : `${process.env.BASE_URL}/incoming_letters/file/${getIncomingLetter.id}`,
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

    let incomingLetter;
    try {
      incomingLetter = await model.findFirst({
        where: { id },
        select: { path: true },
      });
    } catch (error) {
      const errRes: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(errRes);
    }

    if (!incomingLetter) {
      const err: ErrorResponse = {
        status: 404,
        message: 'incomingLetter not found',
      };

      return next(err);
    }

    const path = incomingLetter.path;

    if (!path) {
      const err: ErrorResponse = {
        status: 404,
        message: 'incomingLetter exists, but the file does not exist',
      };

      return next(err);
    }

    try {
      readFileSync(path);
    } catch (error) {
      const err: ErrorResponse = {
        status: 404,
        message: 'incomingLetter exists, but the file does not exist',
      };

      return next(err);
    }

    res.sendFile(path);
  },

  post: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'refNo, sender, about, date, statusId, and incomingLetter parameters required',
      };

      return next(err);
    }

    let data: IncomingLetterData;
    const file = req.file;

    try {
      data = JSON.parse(req.body.data);
    } catch (error) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'refNo, sender, about, date, statusId, and incomingLetter parameters required',
      };

      unlinkSync(file.path);

      return next(err);
    }

    if (
      !req.file ||
      !data.refNo ||
      !data.sender ||
      !data.about ||
      !data.date ||
      !data.statusId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message:
          'refNo, sender, about, date, statusId, and incomingLetter parameters required',
      };

      unlinkSync(file.path);

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
        message: 'incoming letter already exists',
      };

      unlinkSync(file.path);

      return next(err);
    }

    const path = pathModule.join(__dirname, '../../' + file.path);

    try {
      const createdIncomingLetter = await model.create({
        data: {
          refNo: data.refNo,
          sender: data.sender,
          about: data.about,
          date: new Date(data.date),
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
        date: createdIncomingLetter.date,
        path: !createdIncomingLetter.path
          ? null
          : `${process.env.BASE_URL}/incoming_letters/file/${createdIncomingLetter.id}`,
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
      const err: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      unlinkSync(file.path);

      return next(err);
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

  putFile: async (req: Request, res: Response, next: NextFunction) => {
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
      const letter = await model.findFirst({
        where: {
          id: id,
        },
      });

      if (letter?.path) {
        unlinkSync(letter.path);
      }

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
      message: 'file updated',
    };

    res.json(successResponse);
  },

  put: async (req: Request, res: Response, next: NextFunction) => {
    const incomingLetterId: number =
      typeof req.body.id === 'number'
        ? req.body.id
        : Number.parseInt(req.body.id);
    const data = req.body.data;

    if (!incomingLetterId) {
      const err: ErrorResponse = {
        status: 422,
        message: 'incomingLetterId required',
      };

      return next(err);
    }

    if (
      !data.refNo &&
      !data.sender &&
      !data.about &&
      !data.date &&
      !data.statusId
    ) {
      const err: ErrorResponse = {
        status: 422,
        message: 'refNo, sender, about, date, or statusId parameters required',
      };

      return next(err);
    }

    let updateData = {};

    for (const key in data) {
      if (
        key !== 'refNo' &&
        key !== 'sender' &&
        key !== 'about' &&
        key !== 'date' &&
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
      const err: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(err);
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
        date: updatedIncomingLetter.date,
        path: !updatedIncomingLetter.path
          ? null
          : `${process.env.BASE_URL}/incoming_letters/file/${updatedIncomingLetter.id}`,
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
      const err: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(err);
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
      const err: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(err);
    }

    if (!isExist) {
      const err: ErrorResponse = {
        status: 404,
        message: 'incoming letter does not exist',
      };

      return next(err);
    }

    try {
      const deletedIncomingLetter = await model.delete({
        where: {
          id: incomingLetterId,
        },
      });

      if (deletedIncomingLetter.path) {
        unlinkSync(deletedIncomingLetter.path);
      }

      const response: SuccessResponse = {
        success: true,
        status: 204,
        message: 'incoming letter deleted',
      };

      res.json(response);
    } catch (error) {
      const err: ErrorResponse = {
        status: 500,
        message: 'there is something wrong, try again later',
      };

      return next(err);
    }
  },
};

export default IncomingLetterController;
