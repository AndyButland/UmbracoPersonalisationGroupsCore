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
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { MemberGroupDto, MemberGroupService } from "@personalisationgroups/generated";

type MemberGroupSetting = {
  match: string;
  groupName: string
};

const elementName = "personalisation-group-member-group-criteria-property-editor";

@customElement(elementName)
export class MemberGroupCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

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
  private _typedValue: MemberGroupSetting = { match: "IsInGroup", groupName: "" };

  @state()
  private _memberGroups: Array<MemberGroupDto> = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.#getMemberGroups();
}

async #getMemberGroups() {
    const { data } = await tryExecute(MemberGroupService.getCollection());
    console.log(data);
    this._memberGroups = data || [];
}

  #getMatchOptions() {
    return [{
        name: "Is in group",
        value: "IsInGroup",
        selected: this._typedValue.match === "IsInGroup",
    },
    {
        name: "Is not in group",
        value: "IsNotInGroup",
        selected: this._typedValue.match === "IsNotInGroup",
    }];
  }

  #onMatchChange(e: UUISelectEvent) {
    this._typedValue.match = e.target.value.toString();
    this.#refreshValue();
  }

  #getGroupOptions() {
    return this._memberGroups.map((g) => {
      return {
        name: g.name,
        value: g.name,
        selected: this._typedValue.groupName === g.name
      }
    });
  }

  #onGroupChange(e: UUISelectEvent) {
    this._typedValue.groupName = e.target.value.toString();
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
          <td class="label"><label for="Group">Value:</label></td>
          <td>
              <uui-select
                  id="Group"
                  label="Group"
                  @change=${this.#onGroupChange}
                  .options=${this.#getGroupOptions()}
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

export default MemberGroupCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: MemberGroupCriteriaPropertyUiElement;
	}
}
