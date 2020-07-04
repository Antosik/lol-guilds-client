/* eslint-disable */
import MarkdownIt from "markdown-it";
import MarkdownIterator from "markdown-it-for-inline";


export const markdown = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true
})
  .disable(["image"])
  .use(MarkdownIterator, "url_new_win", "link_open", function (tokens: any, idx: any) {
    const aIndex = tokens[idx].attrIndex("target");

    if (aIndex < 0) {
      tokens[idx].attrPush(["target", "_blank"]);
    } else {
      tokens[idx].attrs[aIndex][1] = "_blank";
    }
  });

