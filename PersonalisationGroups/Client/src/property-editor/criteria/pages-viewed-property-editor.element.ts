import {
  html,
  customElement,
  property,
  state,
  repeat,
  css,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/property-editor";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { UmbDocumentItemModel, UmbDocumentItemRepository, UmbDocumentPickerInputContext } from "@umbraco-cms/backoffice/document";

const elementName = "personalisation-group-pages-viewed-criteria-property-editor";

type PagesViewedSetting = {
  match: string;
  nodeKeys: Array<string>
};

@customElement(elementName)
export class PagesViewedCriteriaPropertyUiElement extends UmbLitElement implements UmbPropertyEditorUiElement {

  constructor() {
    super();
    this.observe(this.#pickerContext?.selection, async (selection) => (await this.#refreshPickedPages(selection)), '_observeSelection');
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

  #itemRepository = new UmbDocumentItemRepository(this);

	#pickerContext = new UmbDocumentPickerInputContext(this);

  @state()
  private _typedValue: PagesViewedSetting = { match: "ViewedAny", nodeKeys: [] };

  @state()
  private _pickedItems: Array<UmbDocumentItemModel> = [];

	protected async firstUpdated(): Promise<void> {
		this._pickedItems = await this.#getPickedPages(this._typedValue.nodeKeys);
	}

  async #getPickedPages(ids: Array<string>) {
		if (ids.length === 0) return [];
		const { data } = await this.#itemRepository.requestItems(ids);
    return data || [];
  }

  #getMatchOptions() {
    return [{
        name: "Viewed any one of the following pages",
        value: "ViewedAny",
        selected: this._typedValue.match === "ViewedAny",
    },
    {
        name: "Viewed all one of the following pages",
        value: "ViewedAll",
        selected: this._typedValue.match === "ViewedAll",
    },
    {
      name: "Not viewed any one of the following pages",
      value: "NotViewedAny",
      selected: this._typedValue.match === "NotViewedAny",
    },
    {
        name: "Not viewed all one of the following pages",
        value: "NotViewedAll",
        selected: this._typedValue.match === "NotViewedAll",
    }];
  }

  #onMatchChange(e: UUISelectEvent) {
    this._typedValue.match = e.target.value.toString();
    this.#refreshValue();
  }

  #removePickedPage(id: string) {
    this._typedValue.nodeKeys = this._typedValue.nodeKeys.filter(i => i !== id);
    this._pickedItems = this._pickedItems.filter(i => i.unique !== id);
    this.#refreshValue();
  }

	#openPicker() {
		this.#pickerContext.openPicker({
      hideTreeRoot: true
	  });
	}

  async #refreshPickedPages(ids: Array<string>) {
    this._typedValue.nodeKeys = ids;
    this._pickedItems = await this.#getPickedPages(ids);
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
      <p>Please enter the pages viewed criteria settings:</p>
      <table>
        <tr>
          <td class="label"><label for="Match">Visitor has:</label></td>
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
          <td class="label"><label for="Pages">Pages:</label></td>
          <td>
            <uui-ref-list>
              ${repeat(
                this._pickedItems,
                (item) => item.unique,
                (item) => this.#renderItem(item),
              )}
            </uui-ref-list>
            <uui-button
              id="AddPage"
              look="placeholder"
              @click=${this.#openPicker}
              label=${this.localize.term('general_choose')}></uui-button>
          </td>
        </tr>
    </table>`;
  }

  #renderItem(item: UmbDocumentItemModel) {
    const name = item.variants[0]?.name ?? '(Untitled)';
    return html`
      <uui-ref-node name="${name}">
        <umb-icon slot="icon" name="${item.documentType.icon}"></umb-icon>
        <uui-action-bar slot="actions">
          <uui-button
            @click=${() => this.#removePickedPage(item.unique)}
            label="Remove">
            Remove
          </uui-button>
        </uui-action-bar>
    </uui-ref-node>`
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

export default PagesViewedCriteriaPropertyUiElement;

declare global {
	interface HTMLElementTagNameMap {
		[elementName]: PagesViewedCriteriaPropertyUiElement;
	}
}
