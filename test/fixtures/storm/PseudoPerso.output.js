"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PseudoPerso = void 0;

var _StormModel = require("./StormModel");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PseudoPerso extends _StormModel.StormModel {
  constructor(firstname, lastname) {
    super();

    _defineProperty(this, "__firstname", void 0);

    _defineProperty(this, "__lastname", void 0);

    this.firstname = firstname;
    this.lastname = lastname;
    this._computedProperties.set("name", {
      watchedProperties: new Set(),
      compute: this.__compute__name.bind(this)
    });
    this._initComputed();
  }

  get name() {
    this._registerAccess("name");
    return this._computedProperties.get("name").value;
  }

  get firstname() {
    this._registerAccess("firstname");
    return this.__firstname;
  }

  set firstname(__firstname) {
    this.__firstname = __firstname;
  }

  get lastname() {
    this._registerAccess("lastname");
    return this.__lastname;
  }

  set lastname(__lastname) {
    this.__lastname = __lastname;
  }

  __compute__name() {
    return `${this.firstname} ${this.lastname}`;
  }

}

exports.PseudoPerso = PseudoPerso;
