import { ConsoleColor } from '../../utils/console-color';

export class EnvironmentString {
  domain: string;

  private static readonly fieldNameColor = ConsoleColor.Magenta;
  private static readonly fieldValueColor = ConsoleColor.White;
  private static readonly numberFieldValueColor = ConsoleColor.Green;
  private static readonly booleanFieldValueColor = ConsoleColor.Blue;

  constructor(domain: string) {
    this.domain = domain;
  }

  field(
    name: string,
    value: string | number | boolean,
    options?: { useColor?: boolean; obfuscate?: boolean }
  ): string {
    const { useColor = false, obfuscate = false } = options ?? {};

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
