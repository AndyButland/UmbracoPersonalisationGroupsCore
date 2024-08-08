import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";

const elementName = "personalisation-group-months-of-year-criteria-property-editor";

@customElement(elementName)
export class MonthsOfYearCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  #value: string = "";
  @property({ type: String })
  set value(value: string) {
      this.#value = value;
      if (value.length > 0) {
        this._monthValues = JSON.parse(value);
      } else {
        this._monthValues = [];
      }
      this.requestUpdate();
  }

  get value() {
      return this.#value;
  }

  @state()
  private _monthValues: Array<number> = [];

  #months: Array<string> = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  #isMonthSelected(index: number) {
    const monthNumber = index + 1;
    return this._monthValues.indexOf(monthNumber) > -1;
  }

  #onMonthToggle(e: UUIBooleanInputEvent, index: number) {
    const monthNumber = index + 1;
    const checked = e.target.checked;
    if (checked) {
      this._monthValues.push(monthNumber);
      this._monthValues.sort();
    } else {
      this._monthValues = this._monthValues.filter(d => d !== monthNumber)
    }

    this.#refreshValue();
  }

  #refreshValue() {
    this.#value = JSON.stringify(this._monthValues);
    this.dispatchEvent(
      new CustomEvent("change", { composed: true, bubbles: true })
    );
  }

  render() {
    return html`
      <p>Please select the months for which this group will be valid:</p>
      <table>
        ${this.#months.map((d, i) =>
          html`
            <tr>
              <td>${d}: </td>
              <td>
                <uui-toggle
                  ?checked=${this.#isMonthSelected(i)}
                  @change=${(e: UUIBooleanInputEvent) =>
                    this.#onMonthToggle(e, i)}
              ></uui-toggle>
              </td>
            </tr>`)}
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

export default MonthsOfYearCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: MonthsOfYearCriteriaPropertyUiElement;
	}
}
