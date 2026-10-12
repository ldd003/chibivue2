import { baseCompile, baseParse } from "../compiler-core/index.js";

export function compile(template) {
  return baseCompile(template);
}

export function parse(template) {
  return baseParse(template);
}
