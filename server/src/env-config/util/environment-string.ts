import _ from 'lodash';
import { ConsoleColor } from '../../utils/console-color';

type PrimitiveFieldValue = string | number | boolean;

type EnvironmentStringOptions = {
  useColor: boolean;
  obfuscate: boolean;
};

export class EnvironmentString {
  domain: string;
  defaultOptions?: Partial<EnvironmentStringOptions>;

  private static readonly fieldNameColor = ConsoleColor.Magenta;
  private static readonly fieldValueColor = ConsoleColor.White;
  private static readonly numberFieldValueColor = ConsoleColor.Green;
  private static readonly booleanFieldValueColor = ConsoleColor.Blue;
  private static readonly arrayDelimiter = ', ';

  constructor(
    domain: string,
    defaultOptions?: Partial<EnvironmentStringOptions>
  ) {
    this.domain = domain;
    this.defaultOptions = defaultOptions;
  }

  field(
    name: string,
    value: PrimitiveFieldValue | PrimitiveFieldValue[],
    options?: Partial<EnvironmentStringOptions>
  ): string {
    const mergedOptions = this.mergeOptions(options ?? {});

    const baseFieldNameString = `${this.domain}.${name}`;
    const fieldNameString = mergedOptions.useColor
      ? ConsoleColor.apply(
          baseFieldNameString,
          EnvironmentString.fieldNameColor
        )
      : baseFieldNameString;

    const fieldValueString = (Array.isArray(value) ? value : [value])
      .map((item) => this.primitiveField(item, mergedOptions))
      .join(EnvironmentString.arrayDelimiter);

    return `${fieldNameString} = ${fieldValueString}`;
  }

  private primitiveField(
    value: PrimitiveFieldValue,
    options: Partial<EnvironmentStringOptions>
  ): string {
    const { obfuscate = false, useColor = false } = options;

    const baseFieldValueString = obfuscate
      ? value.toString().replace(/./g, '*')
      : value.toString();

    const fieldValueString = useColor
      ? ConsoleColor.apply(
          baseFieldValueString,
          EnvironmentString.getValueColor(value)
        )
      : baseFieldValueString;

    return fieldValueString;
  }

  private mergeOptions(
    options: Partial<EnvironmentStringOptions>
  ): Partial<EnvironmentStringOptions> {
    return _.assign({}, this.defaultOptions, options);
  }

  private static getValueColor(value: string | number | boolean): ConsoleColor {
    switch (typeof value) {
      case 'boolean':
        return this.booleanFieldValueColor;
      case 'number':
        return this.numberFieldValueColor;
      default:
        return this.fieldValueColor;
    }
  }
}
