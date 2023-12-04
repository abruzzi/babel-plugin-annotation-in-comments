import babel from "@babel/core";
import parser from "@babel/parser";

import analyticsPlugin from "./analytics";

const code = `
const MenuItem = () => {
  // @operational("menuitem clicked")
  function handleClick(e) {
    console.log(e.target.value);
  }

  return <div>
    <button onClick={handleClick}>Click me</button>
  </div>
}
`;

const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx"]
});

const { code: transformedCode } = babel.transformFromAstSync(ast, code, {
  plugins: [analyticsPlugin]
});

console.log(transformedCode);