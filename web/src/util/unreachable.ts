export default function unreachable(): never {
  throw new Error("Something bad happened :( Unreachable code.");
}
