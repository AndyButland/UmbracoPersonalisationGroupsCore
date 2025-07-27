  import { defineConfig } from "@hey-api/openapi-ts";

  export default defineConfig({
    input: 'http://localhost:42192/umbraco/swagger/personalisation-groups-management/swagger.json',
    output: {
      lint: "eslint",
      path: "generated",
    },
    plugins: [
      {
        name: "@hey-api/client-fetch",
        bundle: false,
        exportFromIndex: true,
        throwOnError: true,
      },
      {
        name: "@hey-api/typescript",
        enums: "typescript",
        readOnlyWriteOnlyBehavior: "off",
      },
      {
        name: "@hey-api/sdk",
        asClass: true,
        classNameBuilder: '{{name}}Service'
      },
    ],
  })