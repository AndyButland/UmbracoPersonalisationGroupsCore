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
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { MemberTypeDto, MemberService } from "@personalisationgroups/generated";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";

type MemberTypeSetting = {
  match: string;
  typeName: string
};

const elementName = "personalisation-group-member-type-criteria-property-editor";

@customElement(elementName)
export class MemberTypeCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: MemberTypeSetting = { match: "IsOfType", typeName: "" };

  @state()
  private _memberTypes: Array<MemberTypeDto> = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.#getMemberTypes();
  }

  async #getMemberTypes() {
    this._memberTypes = await tryExecute(this.#host, MemberService.getMemberTypeCollection());
  }

  #getMatchOptions() {
    return [{
        name: "Is of type",
        value: "IfOfType",
        selected: this._typedValue.match === "IsOfType",
    },
    {
        name: "Is not of type",
        value: "IsNotOfType",
        selected: this._typedValue.match === "IsNotOfType",
    }];
  }

  #onMatchChange(e: UUISelectEvent) {
    this._typedValue.match = e.target.value.toString();
    this.#refreshValue();
  }

  #getTypeOptions() {
    return this._memberTypes.map((t) => {
      return {
        name: t.name,
        value: t.alias,
        selected: this._typedValue.typeName === t.alias
      }
    });
  }

  #onTypeChange(e: UUISelectEvent) {
    this._typedValue.typeName = e.target.value.toString();
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
      <p>Please enter the member type settings:</p>
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
          <td class="label"><label for="Type">Type:</label></td>
          <td>
              <uui-select
                  id="Type"
                  label="Type"
                  @change=${this.#onTypeChange}
                  .options=${this.#getTypeOptions()}
              ></uui-select>
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

export default MemberTypeCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: MemberTypeCriteriaPropertyUiElement;
	}
}
