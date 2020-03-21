import { declare } from "@babel/helper-plugin-utils";
import path from "path";
import { types as t } from "@babel/core";

export default declare(api => {
  api.assertVersion(7);
  return {
    name: "transform-storm-model",

    visitor: {
      ClassDeclaration(path, state) {
        console.log("oopppppspsps");
      }
    }
  };
});
