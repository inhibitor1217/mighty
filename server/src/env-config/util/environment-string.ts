import { ConsoleColor } from '../../utils/console-color';

export class EnvironmentString {
  domain: string;

  private static readonly fieldNameColor = ConsoleColor.Magenta;
  private static readonly fieldValueColor = ConsoleColor.White;

  constructor(domain: string) {
    this.domain = domain;
  }

  field(name: string, value: string, options: { useColor: boolean }): string {
    const baseFieldNameString = `${this.domain}.${name}`;
    const fieldNameString = options.useColor
      ? ConsoleColor.apply(
          baseFieldNameString,
          EnvironmentString.fieldNameColor
        )
      : baseFieldNameString;

    const fieldValueString = options.useColor
      ? ConsoleColor.apply(value, EnvironmentString.fieldValueColor)
      : value;

    return `${fieldNameString} = ${fieldValueString}`;
  }
}
