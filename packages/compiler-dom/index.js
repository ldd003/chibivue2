import { baseCompile, baseParse } from "../compiler-core/index.js";

export function compile(template, option) {
  const defaultOption = {
    isBrowser: true,
  };
  if (option) {
    Object.assign(defaultOption, option);
  }
  return baseCompile(template, defaultOption);
}

export function parse(template) {
  return baseParse(template);
}
