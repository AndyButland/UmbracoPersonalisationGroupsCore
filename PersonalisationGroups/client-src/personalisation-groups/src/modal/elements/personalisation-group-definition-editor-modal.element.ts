import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { GroupDetailType, PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue } from "../../types";

@customElement('umb-personalisation-group-definition-editor-modal')
export class UmbPersonalisationGroupDefinitionEditorModalElement extends UmbModalBaseElement<PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue> {

	@state()
	_index: number | null = null;

	@state()
	_detail: GroupDetailType = { alias: "", definition: "" };

	private _submit() {

		this._submitModal();
	}

	constructor() {
        super();
	}

	connectedCallback(): void {
		super.connectedCallback();
		if (this.value) {
			this._detail = {
				alias: this.value.detail.alias,
				definition: this.value.detail.definition,
			}
		}
	  }

	render() {
		return html`
			<umb-body-layout headline="Edit Definition">
				<uui-box>
					<umb-personalisation-group-definition-editor-modal-detail .detail="${this._detail}" />
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._rejectModal}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this._submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}
}

export default UmbPersonalisationGroupDefinitionEditorModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-personalisation-group-definition-editor-modal': UmbPersonalisationGroupDefinitionEditorModalElement;
	}
}