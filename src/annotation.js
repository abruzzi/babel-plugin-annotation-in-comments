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

function importFireEventDeclaration(t) {
  return t.importDeclaration(
    [t.importSpecifier(t.identifier('fireUIEvent'), t.identifier('fireUIEvent'))],
    t.stringLiteral('@abc/analytics')
  );
}

function fireUIEventStatement(t, name) {
  return t.expressionStatement(
    t.callExpression(t.identifier('fireUIEvent'), [
      t.stringLiteral(name),
    ])
  );
}

function successStatement(t) {
  return t.expressionStatement(
    t.callExpression(t.identifier('fireUIEvent'), [t.stringLiteral('success')])
  );
}

function errorStatement(t) {
  return t.expressionStatement(
    t.callExpression(t.identifier('fireUIEvent'), [t.stringLiteral('error')])
  );
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
            const importDeclaration = importFireEventDeclaration(t);
            path.node.body.unshift(importDeclaration);
          }
        }
      },

      VariableDeclaration(path, state) {
        const name = getOperationalEventInComments(path);

        if (name) {
          state.needsFireUIEventImport = true;
          path.node.declarations.forEach(declaration => {
            if (t.isArrowFunctionExpression(declaration.init)) {
              declaration.init.body.body.unshift(fireUIEventStatement(t, name));
            }
          });

          path.traverse({
            TryStatement(tryPath) {
              tryPath.node.block.body.push(successStatement(t));
              if (tryPath.node.handler) {
                tryPath.node.handler.body.body.unshift(errorStatement(t));
              }
            }
          });
        }
      },

      FunctionDeclaration(path, state) {
        const name = getOperationalEventInComments(path);
        if (name) {
          state.needsFireUIEventImport = true;
          path.node.body.body.unshift(fireUIEventStatement(t, name));
        }
      },
    }
  };
};