import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["bin/cpx.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  clean: true,
  sourcemap: true,
  banner: { js: "#!/usr/bin/env node" },
});
