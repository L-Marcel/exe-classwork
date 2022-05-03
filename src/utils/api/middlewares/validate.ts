import Joi from "joi";

import { InvalidRequestError } from "../../../errors/api/InvalidRequestError";

function validate(schema: Joi.ObjectSchema, callback: (req: Req, res: Res) => Promise<any>) {
  return async(req: Req, res: Res) => {
    await schema.validateAsync(req.body, {
      abortEarly: false,
      cache: true,
      messages: {
        "array.unique.items": "List does not contain unique values.",
        "leader.required": "Must contain at least one leader.",
        "any.invalid": "Invalid format.",
        "any.only": "Invalid format.",
        "any.required": "Is required.",
        "object.unknown": "Is not allowed.",
        "boolean.base": "Must be a boolean.",
        "array.min": "Length must be at least {#limit}.",
        "string.base": "Must be a string.",
        "string.max": "Length must be less than or equal to {#limit}.",
        "string.min": "Length must be at least {#limit}.",
        "string.email": "Must be a valid email.",
        "string.empty": "Can't to be empty.",
        "number.base": "Must be a number.",
        "number.greater": "Must be greater than {#limit}.",
        "number.integer": "Must be an integer.",
        "number.max": "Must be less than or equal to {#limit}.",
        "number.min": "Must be greater than or equal to {#limit}."
      }
    }).catch(err => {
      throw new InvalidRequestError(err.details);
    });
    
    return await callback(req, res);
  };
};

export { validate };

