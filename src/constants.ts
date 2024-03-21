export const HTTP_RESPONSE_CODE = {
  success: {
    ok: 200,
    created: 201,
    noContent: 204,
  },
  clientError: {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    conflict: 409,
    gone: 410,
    unsupportedMediaType: 415,
    unprocessableContent: 422,
  },
  serverError: {
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
  },
};
