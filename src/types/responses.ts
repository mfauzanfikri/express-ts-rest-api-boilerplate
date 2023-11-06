export type ErrorResponse = {
  success: boolean;
  status: number;
  message: string;
};

export type SuccessResponse = {
  success: boolean;
  status: number;
  message: string;
  data?: Object;
};
