import { ConsoleColor } from '../../utils/console-color';

export class EnvironmentString {
  domain: string;

  private static readonly fieldNameColor = ConsoleColor.Magenta;
  private static readonly fieldValueColor = ConsoleColor.White;

  constructor(domain: string) {
    this.domain = domain;
  }

  field(
    name: string,
    value: string,
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

    const baseFieldValueString = obfuscate ? value.replace(/./g, '*') : value;
    const fieldValueString = useColor
      ? ConsoleColor.apply(
          baseFieldValueString,
          EnvironmentString.fieldValueColor
        )
      : value;

    return `${fieldNameString} = ${fieldValueString}`;
  }
}
