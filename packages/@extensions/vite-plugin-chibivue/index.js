import { createFilter } from "vite";
import { parse } from "../../compiler-sfc/index.js";
import { compile } from "../../compiler-dom/index.js";
import { rewriteDefault } from "../../compiler-sfc/rewriteDefault.js";

export default function vitePluginChibivue() {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform(code, id) {
      if (!filter(id)) return;

      const outputs = [];
      outputs.push("import * as ChibiVue from 'chibivue'\n");
      console.log(112233, code, parse(code, { filename: id }));

      const { descriptor } = parse(code, { filename: id });

      // --------------------------- 从这里
      const SFC_MAIN = "_sfc_main";
      const scriptCode = rewriteDefault(
        descriptor.script?.content ?? "",
        SFC_MAIN,
      );
      outputs.push(scriptCode);
      // --------------------------- 到这里

      const templateCode = compile(descriptor.template?.content ?? "", {
        isBrowser: false,
      });

      outputs.push(templateCode);
      outputs.push("\n");
      outputs.push(`export default { ...${SFC_MAIN}, render }`);

      console.log(119, id, outputs, outputs.join("\n"));

      return { code: outputs.join("\n") };
    },
  };
}
