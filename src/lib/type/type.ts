import type { z } from "zod";
import type { PatientInfoSchema } from "../schemas";

export type FormValues = z.infer<typeof PatientInfoSchema>;
