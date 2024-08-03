import {
  html,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIInputEvent, UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";

const elementName = "personalisation-group-session-criteria-property-editor";

type SessionSetting = {
  key: string;
  match: string;
  value: string
};

@customElement(elementName)
export class SessionCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  #value: string = "";
  @property({ type: String })
  set value(value: string) {
      this.#value = value;
      if (value.length > 0) {
        this._typedValue = JSON.parse(value);
      }

      this.requestUpdate();
  }

  get value() {
      return this.#value;
  }

  @state()
  private _typedValue: SessionSetting = { key: "", match: "Exists", value: "" };

  #onKeyChange(e: UUIInputEvent) {
    this._typedValue.key = e.target.value.toString();
    this.#refreshValue();
  }

  #getMatchOptions() {
    return [{
        name: "Session key is present",
        value: "Exists",
        selected: this._typedValue.match === "Exists",
    },
    {
        name: "Session key is absent",
        value: "DoesNotExist",
        selected: this._typedValue.match === "DoesNotExist",
    },
    {
        name: "Session value matches",
        value: "MatchesValue",
        selected: this._typedValue.match === "MatchesValue",
    },
    {
        name: "Session value contains",
        value: "ContainsValue",
        selected: this._typedValue.match === "ContainsValue",
    },
    {
        name: "Session value is greater than",
        value: "GreaterThanValue",
        selected: this._typedValue.match === "GreaterThanValue",
    },
    {
        name: "Session value is greater than or equal to",
        value: "GreaterThanOrEqualToValue",
        selected: this._typedValue.match === "GreaterThanOrEqualToValue",
    },
    {
        name: "Session value is less than",
        value: "LessThanValue",
        selected: this._typedValue.match === "LessThanValue",
    },
    {
        name: "Session value is less than or equal to",
        value: "LessThanOrEqualToValue",
        selected: this._typedValue.match === "LessThanOrEqualToValue",
    },
    {
        name: "Matches regular expression",
        value: "MatchesRegex",
        selected: this._typedValue.match === "MatchesRegex",
    },
    {
        name: "Does not match regular expression",
        value: "DoesNotMatchRegex",
        selected: this._typedValue.match === "DoesNotMatchRegex",
    }];
  }

  #onMatchChange(e: UUISelectEvent) {
    this._typedValue.match = e.target.value.toString();
    this.#refreshValue();
  }

  #isValueRequired() {
    return this._typedValue.match !== "Exists" && this._typedValue.match !== "DoesNotExist"
  }

  #onValueChange(e: UUIInputEvent) {
    this._typedValue.value = e.target.value.toString();
    this.#refreshValue();
  }

  #refreshValue() {
    this.#value = JSON.stringify(this._typedValue)
    this.dispatchEvent(
      new CustomEvent("change", { composed: true, bubbles: true })
    );
  }

  render() {
    return html`
      <table>
        <tr>
            <td><label for="Key">Key:</label></td>
            <td>
              <uui-input
                  id="Key"
                  label="Key"
                  .value=${this._typedValue.key}
                  @change=${this.#onKeyChange}>
                </uui-input>
            </td>
        </tr>
        <tr>
          <td><label for="Match">Comparison:</label></td>
          <td>
              <uui-select
                  id="Match"
                  label="Match"
                  @change=${this.#onMatchChange}
                  .options=${this.#getMatchOptions()}
              ></uui-select>
          </td>
        </tr>
        <tr>
        <td><label for="Value">Value:</label></td>
        <td>
          <uui-input
              id="Value"
              label="Value"
              ?disabled=${!this.#isValueRequired()}
              .value=${this._typedValue.value}
              @change=${this.#onValueChange}>
            </uui-input>
        </td>
        </tr>
    </table>`;
  }
}

export default SessionCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: SessionCriteriaPropertyUiElement;
	}
}
