import type { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as propertyEditorManifests } from "./property-editor/manifests.js";
import { manifests as translatorManifests } from "./translator/manifests.js";
import { client } from "@personalisationgroups/generated";

export * from "./modal/index.js";
export * from "./property-editor/index.js";
export * from "./translator/index.js";

const manifests: Array<UmbExtensionManifest> = [
  ...modalManifests,
  ...propertyEditorManifests,
  ...translatorManifests,
];

export const onInit: UmbEntryPointOnInit = (host, extensionRegistry) => {
  extensionRegistry.registerMany(manifests);

  host.consumeContext(UMB_AUTH_CONTEXT, async (authContext) => {
    if (!authContext) return;
    const config = authContext.getOpenApiConfiguration();

    client.setConfig({
      baseUrl: config.base,
      auth: async () => await authContext.getLatestToken(),
      credentials: config.credentials,
    });
  });
};