import { createFilter } from "vite";
import { parse } from "../../compiler-sfc/index.js";
import { compile } from "../../compiler-dom/index.js";

export default function vitePluginChibivue() {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform(code, id) {
      if (!filter(id)) return;

      const outputs = [];
      outputs.push("import * as ChibiVue from 'chibivue'\n");

      const { descriptor } = parse(code, { filename: id });
      const templateCode = compile(descriptor.template?.content ?? "", {
        isBrowser: false,
      });

      outputs.push(templateCode);
      outputs.push("\n");
      outputs.push("export default { render }");

      console.log(119, id, outputs);

      return { code: outputs.join("\n") };
    },
  };
}
