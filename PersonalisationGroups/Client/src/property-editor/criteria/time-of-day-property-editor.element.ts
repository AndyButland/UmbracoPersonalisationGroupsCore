import {
  html,
  customElement,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIInputElement, UUIInputEvent } from "@umbraco-cms/backoffice/external/uui";

type TimeOfDaySetting = {
  from: number;
  to: number;
};

const elementName = "personalisation-group-time-of-day-criteria-property-editor";

@customElement(elementName)
export class TimeOfDayCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: Array<TimeOfDaySetting> = [];

  @state()
  private _editIndex: number = -1;

  #onFromChange(e: UUIInputEvent) {
    this._typedValue[this._editIndex].from = parseInt(e.target.value.toString());
    this.#refreshValue();
  }

  #onToChange(e: UUIInputEvent) {
    this._typedValue[this._editIndex].to = parseInt(e.target.value.toString());
    this.#refreshValue();
  }

  #editEntry(index: number) {
    this._editIndex = index;
  }

  #removeEntry(index: number) {
    this._typedValue.splice(index, 1);
    this.#refreshValue();
  }

  #closeEntry() {
    this._editIndex = -1;
  }

  #addEntry() {
    const fromElement = this.shadowRoot?.getElementById("newFrom") as UUIInputElement;
    const toElement = this.shadowRoot?.getElementById("newTo") as UUIInputElement;
    this._typedValue.push({
      from: parseInt(fromElement.value.toString()),
      to: parseInt(toElement.value.toString()),
    });
    fromElement.value = "";
    toElement.value = "";
    this.#refreshValue();
  }

  #refreshValue() {
    this.#value = JSON.stringify(this._typedValue);
    this.dispatchEvent(
      new CustomEvent("change", { composed: true, bubbles: true })
    );
  }

  render() {
    return html`
      <p>Please enter the time ranges for which this group will be valid. Times must be entered in 24h clock format, e.g. 1030, 1400:</p>
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          ${this._typedValue.map((t, i) =>
            html`
              <tr>
                <td>
                  ${this._editIndex == i
                    ? html`
                      <uui-input
                        label="From"
                        .value=${t.from.toString().padStart(4, "0")}
                        @change=${this.#onFromChange}>
                      </uui-input>`
                    : html`
                      <span>${t.from.toString().padStart(4, "0")}`}
                </td>
                <td>
                  ${this._editIndex == i
                    ? html`
                      <uui-input
                        label="To"
                        .value=${t.to.toString().padStart(4, "0")}
                        @change=${this.#onToChange}>
                      </uui-input>`
                    : html`
                      <span>${t.to.toString().padStart(4, "0")}`}
                </td>
                <td nowrap>
                  ${this._editIndex == i
                    ? html`
                      <uui-button
                          label="Close"
                          look="outline"
                          @click=${this.#closeEntry}
                      ></uui-button>`
                    : html`
                      <uui-button
                          label="Edit"
                          look="outline"
                          @click=${() => this.#editEntry(i)}
                      ></uui-button>
                      <uui-button
                          label="Delete"
                          look="outline"
                          color="danger"
                          @click=${() => this.#removeEntry(i)}
                      ></uui-button>`}
                </td>
              </tr>`)}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <uui-input
                id="newFrom"
                label="From"
              </uui-input>
            </td>
            <td>
              <uui-input
                id="newTo"
                label="To"
              </uui-input>
            </td>
            <td>
              <uui-button
                label="Add"
                look="outline"
                @click=${this.#addEntry}
              ></uui-button>
            </td>
          </tr>
        </tfoot>
      </table>`;
  }
}

export default TimeOfDayCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: TimeOfDayCriteriaPropertyUiElement;
	}
}
