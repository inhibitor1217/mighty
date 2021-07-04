import type { FormikConfig, FormikHelpers } from "formik";

export interface FormPreset<Values> extends Partial<FormikConfig<Values>> {
  onSubmit: (values: Values, formikHelpers: FormikHelpers<Values>) => void | Promise<any>;
}
