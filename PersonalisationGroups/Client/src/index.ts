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

export const onInit: UmbEntryPointOnInit = (host, extensionRegistry) => {
  extensionRegistry.registerMany(manifests);

  host.consumeContext(UMB_AUTH_CONTEXT, async (instance) => {
    if (!instance) return;

    OpenAPI.TOKEN = () => instance.getLatestToken();
    OpenAPI.WITH_CREDENTIALS = true;
  });
};
