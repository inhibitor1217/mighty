/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

export enum ConsoleColor {
  Black = 'black',
  Red = 'red',
  Green = 'green',
  Yellow = 'yellow',
  Blue = 'blue',
  Magenta = 'magenta',
  Cyan = 'cyan',
  White = 'white',
}

export namespace ConsoleColor {
  export const values: string[] = [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
  ];

  const prefixes: Record<ConsoleColor, string> = {
    [ConsoleColor.Black]: '\x1b[30m',
    [ConsoleColor.Red]: '\x1b[31m',
    [ConsoleColor.Green]: '\x1b[32m',
    [ConsoleColor.Yellow]: '\x1b[33m',
    [ConsoleColor.Blue]: '\x1b[34m',
    [ConsoleColor.Magenta]: '\x1b[35m',
    [ConsoleColor.Cyan]: '\x1b[36m',
    [ConsoleColor.White]: '\x1b[37m',
  };

  const reset: string = '\x1b[0m';

  export function apply(value: string, color: ConsoleColor): string {
    return `${prefixes[color]}${value}${reset}`;
  }
}
