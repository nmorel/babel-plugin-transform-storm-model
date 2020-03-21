import { types, transformSync } from "@babel/core";
import fs from "fs";
import path from "path";

import myPlugin from "../src/index.js";

describe("Person", () => {
  it("test", () => {
    // const input = fs.readFileSync(
    //   path.join(__dirname, "fixtures/person/input.ts"),
    //   "utf-8"
    // );
    // const output = transformSync(input, {
    //   filename: "person.ts",
    //   plugins: [myPlugin]
    // });
    // console.log(output.code);
  });
});
