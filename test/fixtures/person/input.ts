import { StormModel } from "./decorator";

interface IPersonData {
  firstname: string;
  lastname: string;
}

interface IPerson extends IPersonData {
  name: string;
  isAuthor: boolean;
}

export class Person implements IPerson, StormModel {
  firstname: string;
  lastname: string;

  constructor(person: IPersonData) {
    this.firstname = person.firstname;
    this.lastname = person.lastname;
  }

  get name(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  get isAuthor(): boolean {
    return this.lastname === "Momo";
  }
}
