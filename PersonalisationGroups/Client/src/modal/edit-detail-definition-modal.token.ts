import { UmbModalToken } from "@umbraco-cms/backoffice/modal";
import { PersonalisationGroupDetail } from "../types";

export const EDIT_DETAIL_DEFINITION_MODAL_ALIAS = "PersonalisationGroups.Modal.EditDetailDefinition";

export interface EditDetailDefinitionModalData {
	criteriaName: string,
	propertyEditorUiAlias: string,
}

export interface EditDetailDefinitionModalValue {
  detail: PersonalisationGroupDetail,
}

export const EDIT_DETAIL_DEFINITION_MODAL = new UmbModalToken<
EditDetailDefinitionModalData,
EditDetailDefinitionModalValue
>(EDIT_DETAIL_DEFINITION_MODAL_ALIAS, {
  modal: {
    type: "sidebar",
    size: "medium",
  },
});
