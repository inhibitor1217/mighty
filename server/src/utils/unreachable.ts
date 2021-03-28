export function unreachable(): never {
  throw new Error('Something is wrong: unreachable code');
}
