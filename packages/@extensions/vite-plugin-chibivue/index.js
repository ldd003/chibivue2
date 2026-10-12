import { createFilter } from "vite";
import { parse } from "../../compiler-sfc/index.js";

export default function vitePluginChibivue() {
  const filter = createFilter(/\.vue$/);

  return {
    name: "vite:chibivue",
    transform(code, id) {
      if (!filter(id)) return;

      const { descriptor } = parse(code, { filename: id });

      console.log(119, id, descriptor);

      return { code: `export default {}` };
    },
  };
}
