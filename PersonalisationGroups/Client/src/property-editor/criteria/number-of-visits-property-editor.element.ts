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

type NumberOfVisitsSetting = {
  match: string;
  number: number
};

const elementName = "personalisation-group-number-of-visits-criteria-property-editor";

@customElement(elementName)
export class NumberOfVisitsCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: NumberOfVisitsSetting = { match: "MoreThan", number: 0 };

  #getMatchOptions() {
    return [{
        name: "More than",
        value: "MoreThan",
        selected: this._typedValue.match === "MoreThan",
    },
    {
        name: "Less than",
        value: "LessThan",
        selected: this._typedValue.match === "LessThan",
    },
    {
        name: "Exactly",
        value: "Exactly",
        selected: this._typedValue.match === "Exactly",
    }];
  }

  #onMatchChange(e: UUISelectEvent) {
    this._typedValue.match = e.target.value.toString();
    this.#refreshValue();
  }

  #onNumberChange(e: UUIInputEvent) {
    this._typedValue.number = parseInt(e.target.value.toString());
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
      <p>Please enter the number of visits settings:</p>
      <table>
        <tr>
          <td class="label"><label for="Match">Visitor has accessed the site:</label></td>
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
          <td class="label"><label for="Number">Number of times:</label></td>
          <td>
            <uui-input
                id="Number"
                label="Number"
                type="number"
                min="0"
                step="1"
                .value=${this._typedValue.number}
                @change=${this.#onNumberChange}>
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

export default NumberOfVisitsCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: NumberOfVisitsCriteriaPropertyUiElement;
	}
}
