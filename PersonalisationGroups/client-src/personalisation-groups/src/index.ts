import type { UmbEntryPointOnInit } from "@umbraco-cms/backoffice/extension-api";
import type { ManifestTypes } from "@umbraco-cms/backoffice/extension-registry";

import { manifests as propertyEditorManifests } from "./property-editor/manifests.js";
import { manifests as modalManifests } from "./modal/manifests.js";

export * from './property-editor/index.js';
export * from './modal/index.js';

const manifests: Array<ManifestTypes> = [
  ...propertyEditorManifests,
  ...modalManifests,
];

export const onInit: UmbEntryPointOnInit = (_host, extensionRegistry) => {
  extensionRegistry.registerMany(manifests);
};

