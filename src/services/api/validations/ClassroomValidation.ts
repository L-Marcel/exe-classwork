import Joi from "joi";

class ClassroomValidation {
  static create = Joi.object({
    title: Joi.string().required().min(3).max(40),
    subject: Joi.string().optional().min(3).max(20).allow(null, ''),
    description: Joi.string().optional().max(800).allow(null, '')
  }).required();

  static update = Joi.object({
    title: Joi.string().min(3).max(20),
    subject: Joi.string().min(3).max(18).allow(null, ''),
    description: Joi.string().max(800).allow(null, '')
  }).required().disallow({});
};

export { ClassroomValidation };

