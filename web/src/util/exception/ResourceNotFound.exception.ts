export default class ResourceNotFoundException extends Error {
  constructor(typename: string) {
    super();

    this.name = "ResourceNotFoundException";
    this.message = `${typename} not found`;
  }

  get code(): string {
    return this.name;
  }
}
