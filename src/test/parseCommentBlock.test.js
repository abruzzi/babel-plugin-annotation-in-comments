import * as parser from "@babel/parser";
import {parseCommentBlock} from "../parseCommentBlock.js";

describe('parse the whole comment block into a object', () => {
  it('handles multiple lines of comments', () => {
    const code = parser.parse(`
    // @operational("fetchIssues", "track")
    // @experiment("fetchIssues")
    const abc = () => {}
    `)

    const parsedComments = code.comments;
    const result = parseCommentBlock(parsedComments);

    expect(result.length).toEqual(2);

    expect(result[0][0]).toEqual("operational");
    expect(result[0][1]).toEqual(["fetchIssues", "track"]);

    expect(result[1][0]).toEqual("experiment");
    expect(result[1][1]).toEqual(["fetchIssues"]);
  })
})