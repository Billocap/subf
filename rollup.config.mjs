import path from "path";
import { config } from "dotenv";
import { expand } from "dotenv-expand";

expand(config());

import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/app.ts",
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    typescript(),
    alias({
      entries: [
        {
          find: "@/",
          replacement: path.resolve("src"),
        },
      ],
    }),
    nodeResolve(),
    commonjs(),
    terser({
      format: {
        comments: false,
      },
      compress: false,
    }),
  ],
};
