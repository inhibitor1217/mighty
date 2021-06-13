export default class AssertionException extends Error {
  constructor(message: string) {
    super();

    this.name = "AssertionException";
    this.message = message;
  }
}
