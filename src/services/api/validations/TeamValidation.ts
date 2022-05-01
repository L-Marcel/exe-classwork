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
    team: Joi.object({
      title: Joi.string().required().min(3).max(30),
      description: Joi.string().optional().max(800).allow(null, '')
    }).required(),
    users: Joi.array().items(this.relation).min(2).custom((values: Partial<TeamRelation>[], helpers) => {
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
    })
  }).required();
};

export { TeamValidation };

