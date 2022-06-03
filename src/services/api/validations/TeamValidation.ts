import Joi from "joi";

class TeamValidation {
  static user = Joi.object({
    id: Joi.string().uuid().required(),
    username: Joi.string().required()
  }).required();

  static relation = Joi.object({
    role: Joi.string().required().allow("LEADER", "MEMBER").only(),
    user: this.user
  }).required();

  static create = Joi.object({
    title: Joi.string().required().min(3).max(30),
    description: Joi.string().optional().max(800).allow(null, ''),
    users: Joi.array().items(this.relation).min(1).custom((values: Partial<TeamRelation>[], helpers) => {
      for(let n in values) {
        const relation = values[n];

        if(values.some((u, i) => {
          return u.user.id === relation.user.id && i !== Number(n);
        })) {
          return helpers.error("array.unique.items");
        };
      };

      if(!values.some(v => v.role === "LEADER")) {
        return helpers.error("leader.required");
      };

      return values;
    }),
    repository: Joi.object({
      description: Joi.string().optional().allow(null, ''),
      fullname: Joi.string().required(),
      gitUrl: Joi.string().optional().allow(null, ''),
      homepage:Joi.string().optional().allow(null, ''),
      name: Joi.string().required(),
      owner: this.user.required(),
      sshUrl: Joi.string().optional().allow(null, ''),
    }).optional()
  }).required();
};

export { TeamValidation };

