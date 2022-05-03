import * as yup from "yup";

class TeamFormValidations {
  static user = yup.object({
    id: yup.string().uuid().required(),
    username: yup.string().required()
  }).required();

  static relation = yup.object({
    role: yup.string().required().is(["LEADER", "MEMBER"]),
    user: this.user
  }).required();

  static repository = yup.object({
    name: yup.string().required(),
    fullname: yup.string().required(),
    description: yup.string().optional(),
    homepage: yup.string().optional(),
    gitUrl: yup.string().optional(),
    sshUrl: yup.string().optional(),
    owner: yup.object({
      id: yup.string().uuid().required(),
      username: yup.string().required()
    }).required()
  })

  static users = yup.array(this.relation).min(2).test("array.unique.items", "Must contain unique users.", value => {
    for(let n in value) {
      const relation = value[Number(n)];

      if((value ?? []).some((u, i) => {
        return u.user.id === relation.user.id && i !== Number(n);
      })) {
        return false;
      };
    };

    return true;
  });

  static create = yup.object({
    title: yup.string().required().min(3).max(30),
    description: yup.string().optional().max(800),
    repository: this.repository.optional(),
    users: this.users,
    leader: this.relation.required()
  }).required();
};

export { TeamFormValidations };

