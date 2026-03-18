import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  root: __dirname,
  resolve: {
    preserveSymlinks: false,
    alias: {
      "react-native-reanimated": path.resolve(
        __dirname,
        "src/__mocks__/react-native-reanimated.ts",
      ),
      "react-native": path.resolve(__dirname, "src/__mocks__/react-native.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
})
