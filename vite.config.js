import { resolve } from "node:path";
import { defineConfig } from "vite";

const sourceDir = resolve(import.meta.dirname, "src");

export default defineConfig({
  root: sourceDir,
  publicDir: false,
  build: {
    outDir: resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    // Firestore alone is ~500 kB minified (~150 kB gzipped); that's the SDK, not our code.
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      input: {
        leaderboard: resolve(sourceDir, "index.html"),
        admin: resolve(sourceDir, "admin.html"),
      },
      output: {
        // Keep the Firebase SDK in its own files so browsers can cache it between deploys.
        codeSplitting: {
          groups: [
            { name: "firebase-auth", test: /node_modules[\\/]@?firebase[\\/]auth/ },
            { name: "firebase", test: /node_modules[\\/]@?firebase/ },
          ],
        },
      },
    },
  },
});
