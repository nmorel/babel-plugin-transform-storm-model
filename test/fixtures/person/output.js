export class Person {
  __v = 1;
  __name_v = 0;
  __isAuthor_v = 0;

  constructor(person) {
    this.firstname = person.firstname;
    this.lastname = person.lastname;
  }

  get name() {
    if (this.__v !== this.__name_v) {
      this.__name = `${this.firstname} ${this.lastname}`;
      this.__name_v = this.__v;
    }
    return this.__name;
  }

  get isAuthor() {
    if (this.__v !== this.__isAuthor_v) {
      this.__isAuthor = this.lastname === "Momo";
      this.__isAuthor_v = this.__v;
    }
    return this.__isAuthor;
  }
}
