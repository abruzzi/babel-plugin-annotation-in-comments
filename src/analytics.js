const supportedEventTypes = ["operational", "ui", "track"];

export default function ({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path, state) {
          state.needsFireUIEventImport = false;
        },

        exit(path, state) {
          if (state.needsFireUIEventImport) {
            const importDeclaration = t.importDeclaration(
              [t.importSpecifier(t.identifier('fireUIEvent'), t.identifier('fireUIEvent'))],
              t.stringLiteral('@abc/analytics')
            );
            path.node.body.unshift(importDeclaration);
          }
        }
      },

      VariableDeclaration(path, state) {
        if (path.node.leadingComments) {
          path.node.leadingComments.forEach(comment => {
            if (comment.value.includes('@operational')) {
              const matches = comment.value.match(/@operational\("([^"]+)"\)/);
              if (matches) {
                const [_, eventName, description] = matches;
                state.needsFireUIEventImport = true;
                // Find the arrow function in the variable declaration
                path.node.declarations.forEach(declaration => {
                  if (t.isArrowFunctionExpression(declaration.init)) {
                    // Add a new statement at the beginning of the function body
                    const newStatement = t.expressionStatement(
                      t.callExpression(t.identifier('fireUIEvent'), [
                        t.stringLiteral(eventName),
                      ])
                    );

                    declaration.init.body.body.unshift(newStatement);
                  }
                });
              }
            }
          });
        }
      },

      FunctionDeclaration(path, state) {
        if (path.node.leadingComments) {
          path.node.leadingComments.forEach(comment => {
            if (comment.value.includes('@operational')) {
              const matches = comment.value.match(/@operational\("([^"]+)"\)/);
              if (matches) {
                const [_, eventName, description] = matches;
                state.needsFireUIEventImport = true;
                // Find the arrow function in the variable declaration
                const newStatement = t.expressionStatement(
                  t.callExpression(t.identifier('fireUIEvent'), [
                    t.stringLiteral(eventName),
                  ])
                );

                path.node.body.body.unshift(newStatement);
              }
            }
          });
        }
      },

    }
  };
};