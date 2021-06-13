import { useMemo } from "react";
import {
  Badge,
  SectionLabel,
  TagBadgeSize,
  TagBadgeVariant,
  Text,
  Typography,
} from "@channel.io/bezier-react";
import { useField } from "formik";
import _ from "lodash";

import unreachable from "util/unreachable";

import type FieldProps from "./Field.type";
import Styled from "./Field.styled";

const Field = <T extends string | number>({
  className,
  icon,
  label,
  description,
  help,
  required,
  readonly = false,
  renderInput,
  ...restProps
}: FieldProps<T>) => {
  const [input, meta, helper] = useField<T>(restProps);

  const InputElement = useMemo(() => renderInput({ input, meta, helper, readonly }), [
    input,
    meta,
    helper,
    readonly,
    renderInput,
  ]);

  const sectionLabelLeftContent = useMemo(() => (_.isNil(icon) ? icon : { icon }), [icon]);

  const sectionLabelContent = useMemo(() => {
    if (!required) {
      return label;
    }

    return (
      <Styled.SectionLabelContentWrapper>
        <Text typo={Typography.Size13} bold>
          {label}
        </Text>
        <Badge size={TagBadgeSize.XS} variant={TagBadgeVariant.Yellow}>
          필수
        </Badge>
      </Styled.SectionLabelContentWrapper>
    );
  }, [label, required]);

  const sectionLabelHelp = useMemo(
    () => (_.isEmpty(help) ? undefined : { tooltipContent: help ?? unreachable() }),
    [help]
  );

  return (
    <Styled.Wrapper className={className}>
      <SectionLabel
        leftContent={sectionLabelLeftContent}
        content={sectionLabelContent}
        help={sectionLabelHelp}
      />

      {!_.isEmpty(description) && (
        <Text typo={Typography.Size12} color="txt-black-dark" marginTop={4} marginLeft={12}>
          {description}
        </Text>
      )}

      {InputElement}
    </Styled.Wrapper>
  );
};

export default Field;
