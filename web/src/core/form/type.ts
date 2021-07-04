import type { FormikConfig } from "formik";

export interface FormPreset<Values> extends Partial<FormikConfig<Values>> {}
