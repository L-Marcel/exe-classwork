import Joi from "joi";

class RepositoryValidation {
  static user = Joi.object({
    id: Joi.string().uuid().required()
  }).required();

  static create = Joi.object({
    description: Joi.string().optional().allow(null, ''),
    fullname: Joi.string().required(),
    gitUrl: Joi.string().optional().allow(null, ''),
    homepage:Joi.string().optional().allow(null, ''),
    name: Joi.string().required(),
    owner: this.user.required(),
    sshUrl: Joi.string().optional().allow(null, ''),
  }).required();
};

export { RepositoryValidation };

