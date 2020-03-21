import { StormModel } from "./StormModel";

export class PseudoPerso extends StormModel {
  firstname: string;
  lastname: string;

  constructor(firstname: string, lastname: string) {
    super();
    this.firstname = firstname;
    this.lastname = lastname;
  }

  get name() {
    return `${this.firstname} ${this.lastname}`;
  }
}
