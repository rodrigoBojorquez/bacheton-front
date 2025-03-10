import type { LoginRequest, RegisterRequest } from "@/core/types/auth.ts";
import { object, ObjectSchema, string, ref } from "yup";

const loginSchema: ObjectSchema<LoginRequest> = object({
  email: string()
    .email("El correo no es valido")
    .required("Campo requerido")
    .default(""),
  password: string().required("Campo requerido").default(""),
});

const registerSchema: ObjectSchema<RegisterRequest & { passwordConfirmation: string }> = object({
  name: string().required("Campo requerido").default(""),
  email: string()
    .email("El correo no es valido")
    .required("Campo requerido")
    .default(""),
  password: string()
    .required("Campo requerido")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "La contraseña debe tener al menos 8 caracteres, con mayúsculas, minúsculas, números y un carácter especial."
    )
    .default(""),
  passwordConfirmation: string()
    .required("Campo requerido")
    .oneOf([ref("password")], "Las contraseñas no coinciden")
    .default(""),
});

export { loginSchema, registerSchema };
