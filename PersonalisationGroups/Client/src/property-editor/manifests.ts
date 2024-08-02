import { manifest as groupDefinitionPropertyEditorUiManifest } from './group-definition/manifests.js';
import { manifests as criteriaManifests } from './criteria/manifests.ts';

export const manifests = [
  groupDefinitionPropertyEditorUiManifest,
  ...criteriaManifests
];
