const getOperationalEventInComments = (path) => {
  if (!path.node.leadingComments || path.node.leadingComments.length === 0) {
    return undefined;
  }

  const annotations = path.node.leadingComments.filter(comment => comment.value.includes("@operational"));
  if (annotations.length === 0) {
    return undefined;
  }

  const matches = annotations[0].value.match(/@operational\("([^"]+)"\)/);

  if (matches) {
    return matches[1]
  } else {
    return undefined;
  }
}

export default function ({types: t}) {
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
        const name = getOperationalEventInComments(path);

        if (name) {
          state.needsFireUIEventImport = true;
          // Find the arrow function in the variable declaration
          path.node.declarations.forEach(declaration => {
            if (t.isArrowFunctionExpression(declaration.init)) {
              // Add a new statement at the beginning of the function body
              const newStatement = t.expressionStatement(
                t.callExpression(t.identifier('fireUIEvent'), [
                  t.stringLiteral(name),
                ])
              );

              declaration.init.body.body.unshift(newStatement);
            }
          });

          path.traverse({
            TryStatement(tryPath) {
              // Add success tracking to the end of the try block
              const successStatement = t.expressionStatement(
                t.callExpression(t.identifier('fireUIEvent'), [t.stringLiteral('success')])
              );
              tryPath.node.block.body.push(successStatement);

              // Add error tracking to the beginning of the catch block
              if (tryPath.node.handler) {
                const errorStatement = t.expressionStatement(
                  t.callExpression(t.identifier('fireUIEvent'), [t.stringLiteral('error')])
                );
                tryPath.node.handler.body.body.unshift(errorStatement);
              }
            }
          });
        }
      },

      FunctionDeclaration(path, state) {
        const name = getOperationalEventInComments(path);
        if (name) {
          state.needsFireUIEventImport = true;
          // Find the arrow function in the variable declaration
          const newStatement = t.expressionStatement(
            t.callExpression(t.identifier('fireUIEvent'), [
              t.stringLiteral(name),
            ])
          );

          path.node.body.body.unshift(newStatement);
        }
      },
    }
  };
};