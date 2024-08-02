import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { EditDetailDefinitionModalData, EditDetailDefinitionModalValue } from "./edit-detail-definition-modal.token";
import { UmbPropertyDatasetElement, UmbPropertyValueData } from "@umbraco-cms/backoffice/property";

const elementName = "edit-detail-definition-modal";

@customElement(elementName)
export class EditDetailDefinitionModalElement extends UmbModalBaseElement<
  EditDetailDefinitionModalData,
  EditDetailDefinitionModalValue
> {

  constructor() {
    super();
  }

  @state()
  _definitionAsPropertyValues: Array<UmbPropertyValueData> = [];

  #getDefinitionAsPropertyValues() {
    const values: Array<UmbPropertyValueData> = [];
    values.push({
      alias: "definition",
      value: this.value.detail.definition,
    });

    return values;
  }

  #onDefinitionChange(e: CustomEvent) {
    const value = (e.target as UmbPropertyDatasetElement).value;
    this._definitionAsPropertyValues = value;
    console.log(this._definitionAsPropertyValues);

    const detail = structuredClone(this.value.detail);
    detail.definition = this._definitionAsPropertyValues[0].value?.toString() ?? "";
    this.modalContext?.updateValue({ detail });
  }

  render() {
    return html`<umb-body-layout headline="Edit Definition: ${this.data?.criteriaName}">
      <div id="main">
        <uui-box>
          <umb-property-dataset
            .value=${this.#getDefinitionAsPropertyValues()}
            @change=${this.#onDefinitionChange}
          >
              <umb-property
                label="Definition"
                description="Configure the criteria's definition with the appropriate values."
                alias="definition"
                property-editor-ui-alias=${this.data?.propertyEditorUiAlias}
              >
              </umb-property>
          </umb-property-dataset>
        </uui-box>
      </div>
      <div slot="actions">
        <uui-button
          label=${this.localize.term("general_close")}
          @click=${this._rejectModal}
        ></uui-button>
        <uui-button
          color="positive"
          look="primary"
          label=${this.localize.term("general_submit")}
          @click=${this._submitModal}
        ></uui-button>
      </div>
    </umb-body-layout>`;
  }
}

export default EditDetailDefinitionModalElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: EditDetailDefinitionModalElement;
  }
}
