import {
  html,
  customElement,
  property,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

const elementName = "personalisation-group-querystring-criteria-property-editor";

@customElement(elementName)
export class QueryStringCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  #value: string = "";
  @property({ type: String })
  set value(value: string) {
      this.#value = value;
      // TODO: To local value.
      this.requestUpdate();
  }

  get value() {
      return this.#value;
  }

  // TODO: From local value
  // #refreshValue() {
  //   this.dispatchEvent(
  //     new CustomEvent("change", { composed: true, bubbles: true })
  //   );
  // }

  render() {
    return html``;
  }
}

export default QueryStringCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: QueryStringCriteriaPropertyUiElement;
	}
}