import { InvalidRequestError } from "../../errors/api/InvalidRequestError";
import { NotFoundError } from "../../errors/api/NotFoundError";

function apiHandle(methods: ApiHandleMethodsFunctions) {
  return async(req: Req, res: Res) => {
    try {
      if(methods[req.method]) {
        return await methods[req.method](req, res);
      } else {
        throw new NotFoundError();
      };
    } catch (err) {
      if(err instanceof InvalidRequestError) {
        return res.status(err.statusCode ?? 400).json({
          message: err.message,
          details: err.details
        });
      };

      return res.status(err.statusCode ?? 400).json({
        message: err.message,
        data: err.data
      });
    }
  };
};

export { apiHandle };

