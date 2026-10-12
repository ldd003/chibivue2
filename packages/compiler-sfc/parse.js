import { NodeTypes } from "../compiler-core/index.js";
import * as CompilerDOM from "../compiler-dom/index.js";

export const DEFAULT_FILENAME = "anonymous.vue";

export function parse(
  source,
  { filename = DEFAULT_FILENAME, compiler = CompilerDOM } = {},
) {
  const descriptor = {
    id: undefined,
    filename,
    source,
    template: null,
    script: null,
    styles: [],
  };
  const ast = compiler.parse(source);

  ast.children.forEach((node) => {
    if (node.type !== NodeTypes.ELEMENT) return;

    switch (node.tag) {
      case "template": {
        descriptor.template = createBlock(node, source);
        break;
      }
      case "script": {
        const scriptBlock = createBlock(node, source);
        descriptor.script = scriptBlock;
        break;
      }
      case "style": {
        descriptor.styles.push(createBlock(node, source));
        break;
      }
      default: {
        break;
      }
    }
  });

  return {
    descriptor,
  };
}

function createBlock(node, source) {
  const type = node.tag;

  let { start, end } = node.loc;
  start = node.children[0].loc.start;
  end = node.children[node.children.length - 1].loc.end;
  const content = source.slice(start.offset, end.offset);

  const loc = { source: content, start, end };
  const block = { type, content, loc };

  return block;
}
