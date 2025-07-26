import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { CountryDto, GeoLocationService } from "@personalisationgroups/generated";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

type CountrySetting = {
  match: string;
  codes: Array<string>,
  names: Array<string>
};

const elementName = "personalisation-group-country-criteria-property-editor";

@customElement(elementName)
export class CountryCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  #host: UmbControllerHost;

  constructor(host: UmbControllerHost) {
    super();
    this.#host = host;
  }

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
  private _typedValue: CountrySetting = { match: "IsLocatedIn", codes: [], names: [] };

  @state()
  private _availableCountries: Array<CountryDto> = [];

  @state()
  private _selectedCountry?: CountryDto = undefined;

  async connectedCallback() {
    super.connectedCallback();
    await this.#getAvailableCountries();
  }

  async #getAvailableCountries() {
    this._availableCountries = await tryExecute(this.#host, GeoLocationService.getCountryCollection());
    this._selectedCountry = this._availableCountries.length > 0
        ? this._availableCountries[0]
        : undefined;
    this.#ensureValues();
  }

  #ensureValues() {
    const availableCodes = this._availableCountries.map(c => c.code);
    this._typedValue.codes = this._typedValue.codes.filter(c => availableCodes.indexOf(c) > -1);
    this._typedValue.names = [];
    for (let index = 0; index < this._typedValue.codes.length; index++) {
      const code = this._typedValue.codes[index];
      this._typedValue.names.push(this.#getCountryByCode(code)!.name);
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

  #getAvailableCountryOptions() {
    return this._availableCountries?.map((c) => {
        return {
            name: c.name,
            value: c.code,
            selected: c.code === this._selectedCountry?.code,
        }
    }) ?? [];
  }

  #onSelectedCountryChange(e: UUISelectEvent) {
    const code = e.target.value.toString();
    this._selectedCountry = this.#getCountryByCode(code);
  }

  #getCountryByCode(code: string) {
    if (this._availableCountries === undefined) {
        return undefined;
    }

    return this._availableCountries.find(c => c.code === code);
  }

  #addCountry() {
    if (!this._selectedCountry) {
      return;
    }

    if (this._typedValue.codes.indexOf(this._selectedCountry.code) > -1) {
      return;
    }

    this._typedValue.codes.push(this._selectedCountry.code);
    this._typedValue.names.push(this._selectedCountry.name);
    this.#refreshValue();
  }

  #removeCountry(index: number) {
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
      <p>Please enter the country settings:</p>
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
          <td class="label"><label for="Countries">Countries:</label></td>
          <td>
            <uui-select
                id="Countries"
                label="Countries"
                @change=${this.#onSelectedCountryChange}
                .options=${this.#getAvailableCountryOptions()}
            ></uui-select>
            <uui-button
                label="Add"
                look="outline"
                @click=${this.#addCountry}
            ></uui-button>
            <table class="selected-items">
              ${this._typedValue.codes.map((c, i) => html`
              <tr>
                <td>${this.#getCountryByCode(c)?.name}</td>
                <td>
                  <uui-button
                      label="Remove"
                      look="outline"
                      color="danger"
                      @click=${() => this.#removeCountry(i)}
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

export default CountryCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: CountryCriteriaPropertyUiElement;
	}
}
