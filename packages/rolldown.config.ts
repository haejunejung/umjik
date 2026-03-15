import { defineConfig } from "rolldown"
import { dts } from "rolldown-plugin-dts"

export default defineConfig([
  {
    input: { index: "src/index.ts" },
    external: ["react", "react-native"],
    plugins: [dts()],
    output: {
      dir: "dist",
      format: "esm",
    },
  },
])
