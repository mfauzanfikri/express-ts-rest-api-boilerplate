// {
//   "message": "msg",
//   "errors": [
//     {
//       "resource": "resourceName",
//       "field": "field",
//       "code": "missing_field"
//     }
//   ]
// }

export type ErrorResponse = {
  success: false;
  status: number;
  message: string;
  errors?: Object | Object[];
};

export type SuccessResponse = {
  success: boolean;
  status: number;
  message: string;
  data?: Object;
};
