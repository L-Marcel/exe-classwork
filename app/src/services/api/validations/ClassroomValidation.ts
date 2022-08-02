import Joi from "joi";

class ClassroomValidation {
  static create = Joi.object({
    title: Joi.string().required().min(3).max(40),
    subject: Joi.string().optional().min(3).max(20).allow(null, ''),
    description: Joi.string().optional().max(800).allow(null, ''),
    inviteCodeIsRestricted: Joi.boolean().optional(),
    teamsAreRestricted: Joi.boolean().optional(),
    rolesAreRestricted: Joi.boolean().optional(),
    repositoriesAreRestricted: Joi.boolean().optional()
  }).required();

  static update = Joi.object({
    title: Joi.string().required().min(3).max(40),
    subject: Joi.string().optional().min(3).max(20).allow(null, ''),
    description: Joi.string().optional().max(800).allow(null, ''),
    inviteCodeIsRestricted: Joi.boolean().optional(),
    teamsAreRestricted: Joi.boolean().optional(),
    rolesAreRestricted: Joi.boolean().optional(),
    repositoriesAreRestricted: Joi.boolean().optional()
  }).required().disallow({});
};

export { ClassroomValidation };

