import template from "@babel/template";
import * as t from "@babel/types";
import {parseCommentBlock} from "./parseCommentBlock.js";

const importFireAnalyticsTemplate = template`
import { FUNCS } from '@abc/analytics';
`;

const fireUIAnalyticsTemplate = template(`
  fireUIAnalytics(
    createAnalyticsEvent({
      actionSubject: 'SUBJECT',
      action: 'ACTION',
      actionSubjectId: 'SUBJECT_ID',
    }),
  );
`);

const fireOperationalAnalyticsTemplate = template(`
  fireOperationalAnalytics(
    createAnalyticsEvent({
      actionSubject: 'SUBJECT',
      action: 'ACTION',
      actionSubjectId: 'SUBJECT_ID',
    }),
  );
`);

const hasLeadingComments = (path) => path.node.leadingComments && path.node.leadingComments.length !== 0;
const parseComments = (leadingComments) => {
  const parsed = parseCommentBlock(leadingComments);

  return parsed.map(x => {
    switch (x[0]) {
      case 'ui':
        return {
          type: 'ui',
          statement: fireUIAnalyticsStatement(t, x[1])
        };
      case 'operational':
        return {
          type: 'operational',
          statement: fireOperationalAnalyticsStatement(t, x[1])
        };
      default:
        return {
          type: 'noop'
        }
    }
  })
}

function importFireEventDeclaration(t, funcs) {
  return importFireAnalyticsTemplate({
    FUNCS: funcs.join(',')
  });
}

function fireUIEventStatement(t, name) {
  return t.expressionStatement(
    t.callExpression(t.identifier('fireUIEvent'), [
      t.stringLiteral(name),
    ])
  );
}

function fireUIAnalyticsStatement(t, args) {
  return fireUIAnalyticsTemplate({
    ACTION: t.stringLiteral(args[0]),
    SUBJECT: t.stringLiteral(args[1]),
    SUBJECT_ID: t.stringLiteral(args[2])
  });
}

function fireOperationalAnalyticsStatement(t, args) {
  return fireOperationalAnalyticsTemplate({
    SUBJECT: t.stringLiteral(args[0]),
    ACTION: t.stringLiteral(args[1]),
    SUBJECT_ID: t.stringLiteral(args[2])
  })
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
          state.needsFireOperationalEventImport = false;
        },

        exit(path, state) {
          const funcs = [];

          if(state.needsFireOperationalEventImport) {
            funcs.push("fireOperationalAnalytics")
          }

          if(state.needsFireUIEventImport) {
            funcs.push("fireUIAnalytics")
          }

          if(state.needsFireUIEventImport || state.needsFireOperationalEventImport) {
            funcs.push("createAnalyticsEvent")

            const importDeclaration = importFireEventDeclaration(t, funcs);
            path.node.body.unshift(importDeclaration);
          }
        }
      },

      VariableDeclaration: function (path, state) {
        if (!hasLeadingComments(path)) {
          return;
        }

        const codeList = parseComments(path.node.leadingComments);

        state.needsFireOperationalEventImport = codeList.some(code => code.type === 'operational');
        state.needsFireUIEventImport = codeList.some(code => code.type === 'ui');

        codeList.forEach(code => {
          path.node.declarations.forEach(declaration => {

            if (t.isArrowFunctionExpression(declaration.init)) {
              declaration.init.body.body.unshift(code.statement);
            }

            if (t.isCallExpression(declaration.init) && declaration.init.callee.name === 'useCallback') {
              const func = declaration.init.arguments[0];
              const deps = declaration.init.arguments[1];

              func.body.body.unshift(code.statement)
              deps.elements.unshift(t.identifier('createAnalyticsEvent'))
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
        })
      },

      FunctionDeclaration(path, state) {
        if(!hasLeadingComments(path)) {
          return;
        }


        const codeList = parseComments(path.node.leadingComments);

        state.needsFireOperationalEventImport = codeList.some(code => code.type === 'operational');
        state.needsFireUIEventImport = codeList.some(code => code.type === 'ui');

        codeList.forEach(code => {
          path.node.body.body.unshift(code.statement);
        })
      },
    }
  };
};