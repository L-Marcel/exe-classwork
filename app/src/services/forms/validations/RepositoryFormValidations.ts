import * as yup from "yup";

class RepositoryFormValidations {
  static create = yup.object({
    repository: yup.object().required()
  });
};

export { RepositoryFormValidations };

