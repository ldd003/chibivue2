import { NodeTypes } from "./ast.js";
import { toHandlerKey } from "../shared/index.js";

export const generate = ({ children }, option) => {
  return `${option.isBrowser ? "return " : ""}function render(_ctx){
    ${option.isBrowser ? "with (_ctx) {" : ""}
      const {h} = ChibiVue;
      return ${genNode(children[0], option)}
   ${option.isBrowser ? "}" : ""}
  }
  `;
};

function genNode(node, option) {
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return genElement(node, option);
    case NodeTypes.TEXT:
      return genText(node);
    case NodeTypes.INTERPOLATION:
      return genInterpolation(node, option);

    default:
      return "";
  }
}

const genElement = (el, option) => {
  return `h("${el.tag}", {${el.props
    .map((prop) => genProp(prop, option))
    .join(
      ", ",
    )}}, [${el.children.map((it) => genNode(it, option)).join(", ")}])`;
};

const genProp = (prop, option) => {
  switch (prop.type) {
    case NodeTypes.ATTRIBUTE:
      return `${prop.name}: "${prop.value?.content}"`;
    case NodeTypes.DIRECTIVE: {
      switch (prop.name) {
        case "on":
          return `${toHandlerKey(prop.arg)}:${option.isBrowser ? "" : "_ctx."}${prop.exp}`;

        default:
          throw new Error(`unexpected directive name. got "${prop.name}"`);
      }
    }
    default:
      throw new Error(`unexpected prop type.`);
  }
};

const genText = (text) => {
  return `\`${text.content}\``;
};

const genInterpolation = (node, option) => {
  return `${option.isBrowser ? "" : "_ctx."}${node.content}`;
};
