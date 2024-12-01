import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIInputEvent, UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";

type CookieSetting = {
  key: string;
  match: string;
  value: string
};

const elementName = "personalisation-group-cookie-criteria-property-editor";

@customElement(elementName)
export class CookieCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: CookieSetting = { key: "", match: "Exists", value: "" };

  #onKeyChange(e: UUIInputEvent) {
    this._typedValue.key = e.target.value.toString();
    this.#refreshValue();
  }

  #getMatchOptions() {
    return [{
        name: "Cookie is present",
        value: "Exists",
        selected: this._typedValue.match === "Exists",
    },
    {
        name: "Cookie is absent",
        value: "DoesNotExist",
        selected: this._typedValue.match === "DoesNotExist",
    },
    {
        name: "Cookie value matches",
        value: "MatchesValue",
        selected: this._typedValue.match === "MatchesValue",
    },
    {
        name: "Cookie value contains",
        value: "ContainsValue",
        selected: this._typedValue.match === "ContainsValue",
    },
    {
        name: "Cookie value is greater than",
        value: "GreaterThanValue",
        selected: this._typedValue.match === "GreaterThanValue",
    },
    {
        name: "Cookie value is greater than or equal to",
        value: "GreaterThanOrEqualToValue",
        selected: this._typedValue.match === "GreaterThanOrEqualToValue",
    },
    {
        name: "Cookie value is less than",
        value: "LessThanValue",
        selected: this._typedValue.match === "LessThanValue",
    },
    {
        name: "Cookie value is less than or equal to",
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
      <p>Please enter the cookie settings:</p>
      <table>
        <tr>
            <td class="label"><label for="Key">Key:</label></td>
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
          <td class="label"><label for="Match">Comparison:</label></td>
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
          <td class="label"><label for="Value">Value:</label></td>
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

  static styles = [
    css`
      td.label {
        vertical-align: top;
        padding-top: 4px;
        padding-right: 4px;
      }
    `,
  ];
}

export default CookieCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: CookieCriteriaPropertyUiElement;
	}
}
