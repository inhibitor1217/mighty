export class PostgresError extends Error {
  code: string;

  constructor(code: string) {
    super();

    this.code = code;
    this.message = `PostgresError: ${code}`;
  }
}
