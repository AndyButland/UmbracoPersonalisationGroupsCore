import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { ContinentDto, GeoLocationService } from "@personalisationgroups/generated";
import { tryExecute } from "@umbraco-cms/backoffice/resources";

type ContinentSetting = {
  match: string;
  codes: Array<string>,
  names: Array<string>
};

const elementName = "personalisation-group-continent-criteria-property-editor";

@customElement(elementName)
export class ContinentCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: ContinentSetting = { match: "IsLocatedIn", codes: [], names: [] };

  @state()
  private _availableContinents: Array<ContinentDto> = [];

  @state()
  private _selectedContinent?: ContinentDto = undefined;

  async connectedCallback() {
    super.connectedCallback();
    await this.#getAvailableContinents();
  }

  async #getAvailableContinents() {
    const { data } = await tryExecute(GeoLocationService.getContinentCollection());
    this._availableContinents = data || [];
    this._selectedContinent = this._availableContinents.length > 0
        ? this._availableContinents[0]
        : undefined;
    this.#ensureValues();
  }

  #ensureValues() {
    const availableCodes = this._availableContinents.map(c => c.code);
    this._typedValue.codes = this._typedValue.codes.filter(c => availableCodes.indexOf(c) > -1);
    this._typedValue.names = [];
    for (let index = 0; index < this._typedValue.codes.length; index++) {
      const code = this._typedValue.codes[index];
      this._typedValue.names.push(this.#getContinentByCode(code)!.name);
    }
  }

  #getMatchOptions() {
    return [{
        name: "Visitor is located in",
        value: "IsLocatedIn",
        selected: this._typedValue.match === "IsLocatedIn",
    },
    {
        name: "Visitor is not located in",
        value: "IsNotLocatedIn",
        selected: this._typedValue.match === "IsNotLocatedIn",
    },
    {
        name: "Visitor cannot be located",
        value: "CouldNotBeLocated",
        selected: this._typedValue.match === "CouldNotBeLocated",
    }];
  }

  #onMatchChange(e: UUISelectEvent) {
    this._typedValue.match = e.target.value.toString();
    this.#refreshValue();
  }

  #getAvailableContinentOptions() {
    return this._availableContinents?.map((c) => {
        return {
            name: c.name,
            value: c.code,
            selected: c.code === this._selectedContinent?.code,
        }
    }) ?? [];
  }

  #onSelectedContinentChange(e: UUISelectEvent) {
    const code = e.target.value.toString();
    this._selectedContinent = this.#getContinentByCode(code);
  }

  #getContinentByCode(code: string) {
    if (this._availableContinents === undefined) {
        return undefined;
    }

    return this._availableContinents.find(c => c.code === code);
  }

  #addContinent() {
    if (!this._selectedContinent) {
      return;
    }

    if (this._typedValue.codes.indexOf(this._selectedContinent.code) > -1) {
      return;
    }

    this._typedValue.codes.push(this._selectedContinent.code);
    this._typedValue.names.push(this._selectedContinent.name);
    this.#refreshValue();
  }

  #removeContinent(index: number) {
    this._typedValue.codes.splice(index, 1);
    this._typedValue.names.splice(index, 1);
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
      <p>Please enter the host settings:</p>
      <table>
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
          <td class="label"><label for="Continents">Continents:</label></td>
          <td>
            <uui-select
                id="Continents"
                label="Continents"
                @change=${this.#onSelectedContinentChange}
                .options=${this.#getAvailableContinentOptions()}
            ></uui-select>
            <uui-button
                label="Add"
                look="outline"
                @click=${this.#addContinent}
            ></uui-button>
            <table class="selected-items">
              ${this._typedValue.codes.map((c, i) => html`
              <tr>
                <td>${this.#getContinentByCode(c)?.name}</td>
                <td>
                  <uui-button
                      label="Remove"
                      look="outline"
                      color="danger"
                      @click=${() => this.#removeContinent(i)}
                  ></uui-button>
                </td>
              </tr>`)}
            </table>
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

      table.selected-items td {
        padding: 4px;
      }
    `,
  ];
}

export default ContinentCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: ContinentCriteriaPropertyUiElement;
	}
}
