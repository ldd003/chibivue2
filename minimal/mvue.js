// create app api
let update = null;
export const createApp = (option) => ({
  mount(selector) {
    const container = document.querySelector(selector);
    let prevVNode = null;
    const setupState = option.setup();
    update = () => {
      const vnode = option.render(setupState);
      render(prevVNode, vnode, container);
      prevVNode = vnode;
    };
    update();
  },
});

// Virtual DOM patch
export const render = (n1, n2, container) => {
  const mountElement = (vnode, container) => {
    const el = document.createElement(vnode.tag);
    el.textContent = vnode.children;
    el.addEventListener("click", vnode.onClick);
    container.appendChild(el);
  };
  const patchElement = (_n1, n2) => {
    container.firstElementChild.textContent = n2.children;
  };
  n1 == null ? mountElement(n2, container) : patchElement(n1, n2);
};

// Virtual DOM
export const h = (tag, onClick, children) => ({ tag, onClick, children });

// Reactivity System
export const reactive = (obj) =>
  new Proxy(obj, {
    get: (target, key, receiver) => Reflect.get(target, key, receiver),
    set: (target, key, value, receiver) => {
      const res = Reflect.set(target, key, value, receiver);
      update?.();
      return res;
    },
  });

// template compiler
const parse = (template) => {
  const RE = /<([a-z]+)\s@click=\"([a-z]+)\">(.+)<\/[a-z]+>/;
  const [_, tag, onClick, children] = template.match(RE) || [];
  if (!tag || !onClick || !children) throw new Error("Invalid template!");
  const regex = /{{(.*?)}}/g;
  let match;
  let lastIndex = 0;
  const parsedChildren = [];
  while ((match = regex.exec(children)) !== null) {
    lastIndex !== match.index &&
      parsedChildren.push(children.substring(lastIndex, match.index));
    parsedChildren.push({ content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }
  lastIndex < children.length &&
    parsedChildren.push(children.substr(lastIndex));
  return { tag, onClick, children: parsedChildren };
};
const codegen = (node) =>
  `(_ctx) => h('${node.tag}', _ctx.${node.onClick}, \`${node.children
    .map((child) =>
      typeof child === "object" ? `\$\{_ctx.${child.content}\}` : child,
    )
    .join("")}\`)`;
const compile = (template) => codegen(parse(template));

// sfc compiler (vite transformer)
export const VitePluginChibivue = () => ({
  name: "vite-plugin-chibivue",
  transform: (code, id) => (id.endsWith(".vue") ? compileSFC(code) : null),
});
const compileSFC = (sfc) => {
  const [_, scriptContent] =
    sfc.match(/<script>\s*([\s\S]*?)\s*<\/script>/) ?? [];
  const [___, defaultExported] =
    scriptContent.match(/export default\s*([\s\S]*)/) ?? [];
  const [__, templateContent] =
    sfc.match(/<template>\s*([\s\S]*?)\s*<\/template>/) ?? [];
  if (!scriptContent || !defaultExported || !templateContent)
    throw new Error("Invalid SFC!");
  let code = "";
  code += "import { h, reactive } from './mvue.js';\n";
  code += `const options = ${defaultExported}\n`;
  code += `Object.assign(options, { render: ${compile(templateContent)} });\n`;
  code += "export default options;\n";
  return { code };
};
