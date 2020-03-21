import { declare } from "@babel/helper-plugin-utils";
import path from "path";
import { types as t } from "@babel/core";

export default declare(api => {
  api.assertVersion(7);
  return {
    name: "transform-storm-model",

    visitor: {
      ClassDeclaration(path) {
        path.traverse({
          ClassBody(bodyPath) {
            bodyPath.node.body.splice(
              0,
              0,
              t.classProperty(t.identifier("__v"), t.numericLiteral(1))
            );

            let propertyIndex = 1;
            bodyPath.traverse({
              ClassMethod(methodPath) {
                if (methodPath.node.kind === "get") {
                  const propertyName = `__${methodPath.node.key.name}`;
                  const propertyNameVersion = `${propertyName}_v`;
                  const propertyNameCompute = `${propertyName}_compute`;
                  bodyPath.node.body.splice(
                    propertyIndex++,
                    0,
                    t.classProperty(
                      t.identifier(propertyNameVersion),
                      t.numericLiteral(0)
                    )
                  );
                  bodyPath.node.body.push(
                    t.classMethod(
                      "method",
                      t.identifier(propertyNameCompute),
                      methodPath.node.params,
                      methodPath.node.body
                    )
                  );
                  methodPath.node.body = t.blockStatement([
                    t.ifStatement(
                      t.binaryExpression(
                        "!==",
                        t.identifier(`this.__v`),
                        t.identifier(`this.${propertyNameVersion}`)
                      ),
                      t.blockStatement([
                        t.expressionStatement(
                          t.assignmentExpression(
                            "=",
                            t.identifier(`this.${propertyName}`),
                            t.callExpression(
                              t.identifier(`this.${propertyNameCompute}`),
                              []
                            )
                          )
                        ),
                        t.expressionStatement(
                          t.assignmentExpression(
                            "=",
                            t.identifier(`this.${propertyNameVersion}`),
                            t.identifier(`this.__v`)
                          )
                        )
                      ])
                    ),
                    t.returnStatement(t.identifier(`this.${propertyName}`))
                  ]);
                }
              }
            });
          }
        });
      }
    }
  };
});
