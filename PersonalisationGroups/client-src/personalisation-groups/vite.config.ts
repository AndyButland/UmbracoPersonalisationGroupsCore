import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      "entry": "src/property-editor-ui-personalisation-group-definition.element.ts",
      "formats": [ "es" ]
    },
    outDir: "../../App_Plugins/PersonalisationGroups",
    sourcemap: true,
    rollupOptions: {
      external: [/^@umbraco/],
    },
  },
});