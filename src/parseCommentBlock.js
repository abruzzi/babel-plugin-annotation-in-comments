import {parseCommentLine} from "./parseCommentLine.js";

export const parseCommentBlock = (comments) => {
  return comments.map(comment => parseCommentLine(comment.value));
}