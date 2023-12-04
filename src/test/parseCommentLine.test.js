import {parseCommentLine} from "../parseCommentLine.js";

describe('comment parser', () => {
  it('supports no marks', () => {
    const comment = `This is nonsense`;
    const result = parseCommentLine(comment);

    expect(result.length).toEqual(0);
  });

  it('supports operational marks', () => {
    const comment = `@operational("hello")`;
    const result = parseCommentLine(comment);

    expect(result[0]).toEqual("operational");
    expect(result[1]).toEqual(["hello"]);
  })

  it('supports ui marks', () => {
    const comment = `@ui("hello")`;
    const result = parseCommentLine(comment);

    expect(result[0]).toEqual("ui");
    expect(result[1]).toEqual(["hello"]);
  })

  it('supports multiple arguments', () => {
    const comment = `@operational("hello", "world")`;
    const result = parseCommentLine(comment);

    expect(result[0]).toEqual("operational");
    expect(result[1]).toEqual(["hello", "world"]);
  })
})