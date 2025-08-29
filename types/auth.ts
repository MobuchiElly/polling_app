import { z } from "zod";
import { loginSchema } from "@/schemas/auth";
import {registerSchema} from "@/schemas/auth";

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export {LoginFormData, RegisterFormValues};