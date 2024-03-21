import { ErrorResponse, SuccessResponse } from '../../types/response.type';

type CreateSuccessResponseParams = {
  status?: number;
  message: string;
  data?: any;
};

/**
 *
 * @param args.status
 * @default 200 OK
 *
 * @returns SuccessResponse object
 */
export const createSuccessResponse = ({
  status = 200,
  message,
  data,
}: CreateSuccessResponseParams): SuccessResponse => {
  return {
    success: true,
    status,
    message,
    data,
  };
};

type CreateErrorResponseParams = {
  status: number;
  message: string;
  errors?: Object | Object[];
};

/**
 *
 * @param args.status
 * @default 400 Bad Request
 *
 * @returns ErrorResponse object
 */
export const createErrorResponse = ({
  status,
  message,
  errors = undefined,
}: CreateErrorResponseParams): ErrorResponse => {
  return {
    success: false,
    status,
    message,
    errors,
  };
};

export const createInternalServerErrorResponse = (): ErrorResponse => {
  return {
    success: false,
    status: 500,
    message: 'Internal server error',
  };
};
