import base from "./base.mjs";

export default [
  ...base,
  {
    files: ["**/*.ts"],
    rules: {
      "no-console": "off"
    }
  }
];
