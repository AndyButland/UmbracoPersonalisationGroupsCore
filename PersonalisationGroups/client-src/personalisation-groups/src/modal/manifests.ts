import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import { PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS } from "../types.js"

const modals: Array<ManifestModal> = [
  {
    type: "modal",
    alias: PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS,
    name: "Personalisation Groups Edit Definition Modal",
    js: () => import("./elements/personalisation-group-definition-editor-modal.element.js"),
  },
];

export const manifests = [...modals];