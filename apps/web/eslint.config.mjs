import config from "@raina/eslint-config/next";
import globals from "globals";

export default [
  ...config,
  {
    files: ["server.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
];
