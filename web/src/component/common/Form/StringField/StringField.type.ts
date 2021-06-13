import type { FieldProps } from "component/common/Form/Field";

interface StringFieldProps extends Omit<FieldProps<string>, "renderInput"> {
  renderInput?: FieldProps<string>["renderInput"];
}

export default StringFieldProps;
