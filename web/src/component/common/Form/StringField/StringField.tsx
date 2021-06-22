import { Text, TextField, Typography } from "@channel.io/bezier-react";
import _ from "lodash";

import Field from "component/common/Form/Field";
import type { FieldProps } from "component/common/Form/Field";

import type StringFieldProps from "./StringField.type";

const defaultRenderStringInput: FieldProps<string>["renderInput"] = ({ input, meta, readonly }) => {
  const { name, value, onChange, onBlur } = input;
  const { error } = meta;

  const hasError = !_.isEmpty(error);

  return (
    <>
      <TextField
        name={name}
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        hasError={hasError}
        readOnly={readonly}
      />

      {hasError && (
        <Text typo={Typography.Size13} color="bgtxt-yellow-normal" marginTop={6}>
          {error}
        </Text>
      )}
    </>
  );
};

const StringField = ({
  icon = "string",
  renderInput = defaultRenderStringInput,
  ...restProps
}: StringFieldProps) => {
  return <Field icon={icon} renderInput={renderInput} {...restProps} />;
};

export default StringField;
