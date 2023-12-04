import * as parser from "@babel/parser";

export const parseCommentLine = (input) => {
  const str = input.trim();

  const annotationSymbolIndex = str.indexOf("@");

  if (annotationSymbolIndex < 0) {
    return [];
  }

  const parsed = parser.parseExpression(str.substring(annotationSymbolIndex + 1));

  const opName = parsed.callee.name;
  const args = parsed.arguments.map(x => x.value);

  return [opName, args];
}