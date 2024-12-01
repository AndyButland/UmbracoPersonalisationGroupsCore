import {
  html,
  customElement,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { PersonalisationGroup } from "../../types";
import PersonalisationGroupDefinitionInput from "./group-definition-input.element";

const elementName = "personalisation-group-definition-property-editor";

@customElement(elementName)
export class PersonalisationGroupDefinitionPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  @property({ type: Object })
  value:
      | PersonalisationGroup
      | undefined = undefined;

  #onChange(event: CustomEvent) {
    this.value = (event.target as PersonalisationGroupDefinitionInput).value;
    this.dispatchEvent(new CustomEvent('property-value-change'));
}

render() {
  return html`<personalisation-group-definition-input
    @change="${this.#onChange}"
    .value="${this.value ?? {}}"></personalisation-group-definition-input>`;
  }

}

export default PersonalisationGroupDefinitionPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: PersonalisationGroupDefinitionPropertyUiElement;
	}
}
