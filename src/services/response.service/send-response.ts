import { Response } from 'express';
import { ErrorResponse, SuccessResponse } from '../../types/response.type';
import { createInternalServerErrorResponse } from './create-response';

/**
 *
 * @param res Express Response
 * @param resData Data to be sent
 * @returns res.status(resData.status).json(resData) - This function returns res object with status and data in JSON format
 */
export const sendJsonResponse = (
  res: Response,
  resData: SuccessResponse | ErrorResponse
) => {
  return res.status(resData.status).json(resData);
};

export const sendInternalServerErrorResponse = (res: Response) => {
  const response = createInternalServerErrorResponse();

  return sendJsonResponse(res, response);
};
