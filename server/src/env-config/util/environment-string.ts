import _ from 'lodash';
import { ConsoleColor } from '../../utils/console-color';

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

  constructor(
    domain: string,
    defaultOptions?: Partial<EnvironmentStringOptions>
  ) {
    this.domain = domain;
    this.defaultOptions = defaultOptions;
  }

  field(
    name: string,
    value: string | number | boolean,
    options?: Partial<EnvironmentStringOptions>
  ): string {
    const { useColor = false, obfuscate = false } = this.mergeOptions(
      options ?? {}
    );

    const baseFieldNameString = `${this.domain}.${name}`;
    const fieldNameString = useColor
      ? ConsoleColor.apply(
          baseFieldNameString,
          EnvironmentString.fieldNameColor
        )
      : baseFieldNameString;

    const baseFieldValueString = obfuscate
      ? value.toString().replace(/./g, '*')
      : value.toString();
    const fieldValueString = useColor
      ? ConsoleColor.apply(
          baseFieldValueString,
          EnvironmentString.getValueColor(value)
        )
      : value;

    return `${fieldNameString} = ${fieldValueString}`;
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
