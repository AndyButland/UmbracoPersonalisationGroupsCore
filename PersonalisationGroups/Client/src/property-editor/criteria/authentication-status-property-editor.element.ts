import {
  html,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";

const elementName = "personalisation-group-authentication-status-criteria-property-editor";

@customElement(elementName)
export class AuthenticationStatusCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  #value: string = "";
  @property({ type: String })
  set value(value: string) {
    this.#value = value;
    this._isAuthenticated = value.length > 0
      ? JSON.parse(value).isAuthenticated
      : false;
    this.requestUpdate();
  }

  get value() {
      return this.#value;
  }

  @state()
  private _isAuthenticated: boolean = false;

  #toggleIsAuthenticated() {
    this._isAuthenticated = !this._isAuthenticated;
    this.#refreshValue();
  }


  #refreshValue() {
    this.#value = JSON.stringify({ isAuthenticated: this._isAuthenticated});
    this.dispatchEvent(
      new CustomEvent("change", { composed: true, bubbles: true })
    );
  }

  render() {
    return html`
      <p>Please enter the authentication status settings:</p>
      <uui-toggle
          label="Is logged in?"
          ?checked=${this._isAuthenticated}
          @change=${this.#toggleIsAuthenticated}
      ></uui-toggle>`;
  }
}

export default AuthenticationStatusCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: AuthenticationStatusCriteriaPropertyUiElement;
	}
}
