import { types, transformSync } from "@babel/core";
import fs from "fs";
import path from "path";

import myPlugin from "../src/index.js";

describe("Person", () => {
  it("test", () => {
    const input = fs.readFileSync(
      path.join(__dirname, "fixtures/storm/PseudoPerso.input.ts"),
      "utf-8"
    );
    const output = transformSync(input, {
      filename: "pseudoPerso.ts",
      plugins: [myPlugin, "@babel/plugin-proposal-class-properties"]
    });
    expect(output.code.trim()).toEqual(fs.readFileSync(
      path.join(__dirname, "fixtures/storm/PseudoPerso.output.js"),
      "utf-8"
    ).trim())
  });
});
