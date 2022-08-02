import { UnauthorizedError } from "../../../errors/api/UnauthorizedError";

function isDev(callback: (req: Req, res: Res) => Promise<any>) {
  return async(req: Req, res: Res) => {
    if(process.env.NODE_ENV !== "development") {
      throw new UnauthorizedError();
    };

    return await callback(req, res);
  };
};

export { isDev };

