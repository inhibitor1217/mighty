export default class InvalidEnvironmentException extends Error {
  constructor(name: string) {
    super();

    this.name = "InvalidEnvironmentException";
    this.message = `Environment variable ${name} does not exist`;
  }
}
