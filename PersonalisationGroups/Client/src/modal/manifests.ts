import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import {
  EDIT_DETAIL_DEFINITION_MODAL_ALIAS,
} from "./index.js";

const modals: Array<ManifestModal> = [
  {
    type: "modal",
    alias: EDIT_DETAIL_DEFINITION_MODAL_ALIAS,
    name: "Edit Detail Definition Modal",
    js: () => import("./edit-detail-definition-modal.element.js"),
  }
];

export const manifests = [...modals];
