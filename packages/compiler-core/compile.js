import { baseParse } from "./parse.js";
import { generate } from "./codegen.js";

export function baseCompile(template, option) {
  const parseResult = baseParse(template.trim());
  console.log(199, parseResult);
  const code = generate(parseResult, option);
  return code;
}
