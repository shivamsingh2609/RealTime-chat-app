import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { ESLint } from "eslint"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // esLint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
 