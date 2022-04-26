import * as yup from "yup";

class ClassroomFormValidation {
  static create = yup.object({
    title: yup.string().required().min(3).max(40),
    subject: yup.string().optional().min(3).max(20),
    description: yup.string().optional().max(800)
  }).required();
};

export { ClassroomFormValidation };

