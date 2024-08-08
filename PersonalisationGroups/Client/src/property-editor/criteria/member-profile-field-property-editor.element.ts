import {
  html,
  customElement,
  property,
  state,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIInputEvent, UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { MemberProfileFieldDto, MemberProfileFieldService } from "@personalisationgroups/generated";

type MemberProfileFieldSetting = {
  alias: string;
  match: string;
  value: string;
};

const elementName = "personalisation-group-member-profile-field-criteria-property-editor";

@customElement(elementName)
export class MemberProfileFieldCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: MemberProfileFieldSetting = { alias: "", match: "Matches", value: "" };

  @state()
  private _memberProfileFields: Array<MemberProfileFieldDto> = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.#getMemberProfileFields();
  }

  async #getMemberProfileFields() {
      const { data } = await tryExecute(MemberProfileFieldService.getCollection());
      this._memberProfileFields = data || [];
  }

  #getFieldOptions() {
    return this._memberProfileFields.map((f) => {
      return {
        name: f.name,
        value: f.alias,
        selected: this._typedValue.alias === f.alias
      }
    });
  }

  #onFieldChange(e: UUISelectEvent) {
    this._typedValue.alias = e.target.value.toString();
    this.#refreshValue();
  }

  #getMatchOptions() {
    return [{
        name: "Matches",
        value: "MatchesValue",
        selected: this._typedValue.match === "MatchesValue",
    },
    {
        name: "Does not match",
        value: "DoesNotMatchValue",
        selected: this._typedValue.match === "DoesNotMatchValue",
    },
    {
        name: "Is greater than",
        value: "GreaterThanValue",
        selected: this._typedValue.match === "GreaterThanValue",
    },
    {
        name: "Is greater than or equal to",
        value: "GreaterThanOrEqualToValue",
        selected: this._typedValue.match === "GreaterThanOrEqualToValue",
    },
    {
        name: "Is less than",
        value: "LessThanValue",
        selected: this._typedValue.match === "LessThanValue",
    },
    {
        name: "Is less than or equal to",
        value: "LessThanOrEqualToValue",
        selected: this._typedValue.match === "LessThanOrEqualToValue",
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
      <p>Please enter the member profile field settings:</p>
      <table>
        <tr>
          <td class="label"><label for="Field">Field:</label></td>
          <td>
              <uui-select
                  id="Field"
                  label="Field"
                  @change=${this.#onFieldChange}
                  .options=${this.#getFieldOptions()}
              ></uui-select>
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
        <tr>
          <td class="label"><label for="Value">Value:</label></td>
          <td>
            <uui-input
                id="Value"
                label="Value"
                .value=${this._typedValue.value}
                @change=${this.#onValueChange}>
              </uui-input>
          </td>
        </tr>
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

export default MemberProfileFieldCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: MemberProfileFieldCriteriaPropertyUiElement;
	}
}
