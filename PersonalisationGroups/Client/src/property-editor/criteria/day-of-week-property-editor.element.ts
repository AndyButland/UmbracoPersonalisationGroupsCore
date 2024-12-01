import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";

const elementName = "personalisation-group-day-of-week-criteria-property-editor";

@customElement(elementName)
export class DayOfWeekCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  #value: string = "";
  @property({ type: String })
  set value(value: string) {
      this.#value = value;
      if (value.length > 0) {
        this._dayValues = JSON.parse(value);
      } else {
        this._dayValues = [];
      }
      this.requestUpdate();
  }

  get value() {
      return this.#value;
  }

  @state()
  private _dayValues: Array<number> = [];

  #days: Array<string> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  #isDaySelected(index: number) {
    const dayNumber = index + 1;
    return this._dayValues.indexOf(dayNumber) > -1;
  }

  #onDayToggle(e: UUIBooleanInputEvent, index: number) {
    const dayNumber = index + 1;
    const checked = e.target.checked;
    if (checked) {
      this._dayValues.push(dayNumber);
      this._dayValues.sort();
    } else {
      this._dayValues = this._dayValues.filter(d => d !== dayNumber)
    }

    this.#refreshValue();
  }

  #refreshValue() {
    this.#value = JSON.stringify(this._dayValues);
    this.dispatchEvent(
      new CustomEvent("change", { composed: true, bubbles: true })
    );
  }

  render() {
    return html`
      <p>Please select the days for which this group will be valid:</p>
      <table>
        ${this.#days.map((d, i) =>
          html`
            <tr>
              <td>${d}: </td>
              <td>
                <uui-toggle
                  ?checked=${this.#isDaySelected(i)}
                  @change=${(e: UUIBooleanInputEvent) =>
                    this.#onDayToggle(e, i)}
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

export default DayOfWeekCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: DayOfWeekCriteriaPropertyUiElement;
	}
}
