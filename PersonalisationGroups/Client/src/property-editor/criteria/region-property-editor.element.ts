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
import { CountryDto, RegionDto, GeoLocationService } from "@personalisationgroups/generated";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

type RegionSetting = {
  match: string;
  countryCode: string,
  codes: Array<string>,
  names: Array<string>
};

const elementName = "personalisation-group-region-criteria-property-editor";

@customElement(elementName)
export class RegionCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: RegionSetting = { match: "IsLocatedIn", countryCode: "", codes: [], names: [] };

  @state()
  private _countries: Array<CountryDto> = [];

  @state()
  private _availableRegions: Array<CountryDto> = [];

  @state()
  private _selectedRegion?: RegionDto = undefined;

  async connectedCallback() {
    super.connectedCallback();
    await this.#getCountries();
  }

  async #getCountries() {
    this._countries = await tryExecute(this.#host, GeoLocationService.getCountryCollection());
    if (this._countries.length > 0) {
      this._availableRegions = await this.#getAvailableRegions(this._countries[0].code);
    } else {
      this._availableRegions = [];
    }
  }

  async #getAvailableRegions(countryCode: string) {
    return await tryExecute(this.#host, GeoLocationService.getRegionCollection({ countryCode }));
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

  #getCountryOptions() {
    return this._countries?.map((c) => {
        return {
            name: c.name,
            value: c.code,
            selected: c.code === this._typedValue.countryCode,
        }
    }) ?? [];
  }

  async #onCountryChange(e: UUISelectEvent) {
    const countryCode = e.target.value.toString();
    this._typedValue.countryCode = countryCode;
    this._availableRegions = await this.#getAvailableRegions(countryCode);
    this.#refreshValue();
  }

  #getAvailableRegionOptions() {
    return this._availableRegions?.map((c) => {
        return {
            name: c.name,
            value: c.code,
            selected: c.code === this._selectedRegion?.code,
        }
    }) ?? [];
  }

  #onSelectedRegionChange(e: UUISelectEvent) {
    const code = e.target.value.toString();
    this._selectedRegion = this.#getRegionByCode(code);
  }

  #getRegionByCode(code: string) {
    if (this._availableRegions === undefined) {
        return undefined;
    }

    return this._availableRegions.find(r => r.code === code);
  }

  #addRegion() {
    if (!this._selectedRegion) {
      return;
    }

    if (this._typedValue.codes.indexOf(this._selectedRegion.code) > -1) {
      return;
    }

    this._typedValue.codes.push(this._selectedRegion.code);
    this._typedValue.names.push(this._selectedRegion.name);
    this.#refreshValue();
  }

  #removeRegion(index: number) {
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
      <p>Please enter the region settings:</p>
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
          <td class="label"><label for="Country">Country:</label></td>
          <td>
              <uui-select
                  id="Country"
                  label="Country"
                  @change=${this.#onCountryChange}
                  .options=${this.#getCountryOptions()}
              ></uui-select>
          </td>
        </tr>
        <tr>
          <td class="label"><label for="Regions">Regions:</label></td>
          <td>
            <uui-select
                id="Regions"
                label="Regions"
                @change=${this.#onSelectedRegionChange}
                .options=${this.#getAvailableRegionOptions()}
            ></uui-select>
            <uui-button
                label="Add"
                look="outline"
                @click=${this.#addRegion}
            ></uui-button>
            <table class="selected-items">
              ${this._typedValue.names.map((r, i) => html`
              <tr>
                <td>${r}</td>
                <td>
                  <uui-button
                      label="Remove"
                      look="outline"
                      color="danger"
                      @click=${() => this.#removeRegion(i)}
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

export default RegionCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: RegionCriteriaPropertyUiElement;
	}
}
