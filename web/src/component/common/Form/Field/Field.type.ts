import type { ReactNode } from "react";
import type { IconName } from "@channel.io/bezier-react";
import type { FieldConfig, FieldInputProps, FieldMetaProps, FieldHelperProps } from "formik";

import type StyledComponentProps from "type/StyledComponent";

type InputRenderFn<T extends string | number> = (props: {
  input: FieldInputProps<T>;
  meta: FieldMetaProps<T>;
  helper: FieldHelperProps<T>;
  readonly: boolean;
}) => ReactNode;

interface FieldProps<T extends string | number> extends StyledComponentProps, FieldConfig<T> {
  icon?: IconName;
  label: string;
  description?: string;
  help?: string;
  required?: boolean;
  readonly?: boolean;
  renderInput: InputRenderFn<T>;

  value: T; // override type from formik
}

export default FieldProps;