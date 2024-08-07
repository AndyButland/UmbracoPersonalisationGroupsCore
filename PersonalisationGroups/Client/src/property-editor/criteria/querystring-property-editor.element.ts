import {
  html,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIInputEvent, UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";

type QueryStringSetting = {
  key: string;
  match: string;
  value: string
}

const elementName = "personalisation-group-querystring-criteria-property-editor";

@customElement(elementName)
export class QueryStringCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: QueryStringSetting = { key: "", match: "Exists", value: "" };

  #onKeyChange(e: UUIInputEvent) {
    this._typedValue.key = e.target.value.toString();
    this.#refreshValue();
  }

  #getMatchOptions() {
    return [{
        name: "Matches value",
        value: "MatchesValue",
        selected: this._typedValue.match === "MatchesValue",
    },
    {
        name: "Does not match value",
        value: "DoesNotMatchValue",
        selected: this._typedValue.match === "DoesNotMatchValue",
    },
    {
        name: "Contains value",
        value: "ContainsValue",
        selected: this._typedValue.match === "ContainsValue",
    },
    {
        name: "Does not contain value",
        value: "DoesNotContainValue",
        selected: this._typedValue.match === "DoesNotContainValue",
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
              .value=${this._typedValue.value}
              @change=${this.#onValueChange}>
            </uui-input>
        </td>
        </tr>
    </table>`;
  }
}

export default QueryStringCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: QueryStringCriteriaPropertyUiElement;
	}
}
