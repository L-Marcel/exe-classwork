import * as yup from "yup";

class TeamFormValidations {
  static relation = yup.object({
    role: yup.string().required().is(["LEADER", "MEMBER"]),
    user: yup.object().required()
  });

  static create = yup.object({
    title: yup.string().required().min(3).max(30),
    description: yup.string().optional().max(800),
    repository: yup.object().optional(),
    users: yup.array(this.relation).min(2).test("users", "Must contain unique users.", value => {
      for(let n in value) {
        const relation = value[Number(n)];
  
        if((value ?? []).some((u, i) => {
          return u.user.id === relation.user.id && i !== Number(n);
        })) {
          return false;
        };
      };
  
      return true;
    }).required(),
    leader: yup.object().required()
  }).required();
};

export { TeamFormValidations };

