import type { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { OpenAPI } from "../generated/index.js";
import { manifests as modalManifests } from "./modal/manifests.js";
import { manifests as propertyEditorManifests } from "./property-editor/manifests.js";
import { manifests as translatorManifests } from "./translator/manifests.js";

export * from "./modal/index.js";
export * from "./property-editor/index.js";
export * from "./translator/index.js";

const manifests: Array<UmbExtensionManifest> = [
  ...modalManifests,
  ...propertyEditorManifests,
  ...translatorManifests,
];

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
  extensionRegistry.registerMany(manifests);

  _host.consumeContext(UMB_AUTH_CONTEXT, async (auth) => {
    if (!auth) return;

    const umbOpenApi = auth.getOpenApiConfiguration();
    OpenAPI.BASE = umbOpenApi.base;
    OpenAPI.TOKEN = umbOpenApi.token;
    OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
    OpenAPI.CREDENTIALS = umbOpenApi.credentials;
  });
};
