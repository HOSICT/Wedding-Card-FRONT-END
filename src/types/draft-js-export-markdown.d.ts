declare module "draft-js-export-markdown" {
  import { ContentState } from "draft-js";

  export function stateToMarkdown(contentState: ContentState): string;
}
