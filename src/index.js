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
            let propertyIndex = 0;

            let constructor = null;
            let computed = [];

            bodyPath.traverse({
              ClassProperty(propertyPath) {
                const propertyName = propertyPath.node.key.name;
                if (!propertyName.startsWith("_")) {
                  const privateName = "__" + propertyName;
                  propertyPath.node.key.name = privateName;

                  // Getter
                  bodyPath.node.body.push(
                    t.classMethod(
                      "get",
                      t.identifier(propertyName),
                      [],
                      t.blockStatement([
                        t.expressionStatement(
                          t.callExpression(
                            t.identifier("this._registerAccess"),
                            [t.stringLiteral(propertyName)]
                          )
                        ),
                        t.returnStatement(t.identifier(`this.${privateName}`))
                      ])
                    )
                  );

                  // Setter
                  bodyPath.node.body.push(
                    t.classMethod(
                      "set",
                      t.identifier(propertyName),
                      [t.identifier(privateName)],
                      t.blockStatement([
                        t.expressionStatement(
                          t.assignmentExpression(
                            "=",
                            t.identifier(`this.${privateName}`),
                            t.identifier(privateName)
                          )
                        )
                      ])
                    )
                  );
                }
                propertyIndex++;
              },
              ClassMethod(methodPath) {
                if (methodPath.node.kind === "constructor") {
                  constructor = methodPath;
                } else if (methodPath.node.kind === "get") {
                  const computedPropertyName = methodPath.node.key.name;
                  const computedPropertyComputeFnName = `__compute__${computedPropertyName}`;

                  bodyPath.node.body.push(
                    t.classMethod(
                      "method",
                      t.identifier(computedPropertyComputeFnName),
                      methodPath.node.params,
                      methodPath.node.body
                    )
                  );

                  methodPath.node.body = t.blockStatement([
                    t.expressionStatement(
                      t.callExpression(t.identifier("this._registerAccess"), [
                        t.stringLiteral(computedPropertyName)
                      ])
                    ),
                    t.returnStatement(
                      t.memberExpression(
                        t.callExpression(
                          t.identifier("this._computedProperties.get"),
                          [t.stringLiteral(computedPropertyName)]
                        ),
                        t.identifier("value")
                      )
                    )
                  ]);

                  computed.push(computedPropertyName);
                }
              }
            });

            // Add every computed properties to the map
            computed.forEach(computedPropertyName => {
              constructor.node.body.body.push(
                t.expressionStatement(
                  t.callExpression(
                    t.identifier("this._computedProperties.set"),
                    [
                      t.stringLiteral(computedPropertyName),
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier("watchedProperties"),
                          t.newExpression(t.identifier("Set"), [])
                        ),
                        t.objectProperty(
                          t.identifier("compute"),
                          t.callExpression(
                            t.identifier(
                              `this.__compute__${computedPropertyName}.bind`
                            ),
                            [t.thisExpression()]
                          )
                        )
                      ])
                    ]
                  )
                )
              );
            });

            constructor.node.body.body.push(
              t.expressionStatement(
                t.callExpression(t.identifier("this._initComputed"), [])
              )
            );
          }
        });
      }
    }
  };
});
