import { createFilter } from "vite";
import { parse } from "../../compiler-sfc/index.js";

export default function vitePluginChibivue() {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform(code, id) {
      if (!filter(id)) return;

      const { descripter } = parse(code, { filename: id });

      console.log(119, descripter);

      return { code: `export default {}` };
    },
  };
}
