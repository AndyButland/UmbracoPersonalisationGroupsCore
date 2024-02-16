import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue } from "../../types";

@customElement('umb-personalisation-group-definition-editor-modal')
export class UmbPersonalisationGroupDefinitionEditorModalElement extends UmbModalBaseElement<PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue> {


	@state()
	_index: number | null = null;

	@state()
	_definition: string = "";

	private _submit() {
		//this.modalContext?.submit({ index: this._index, definition: this._definition });
	}

	private _close() {
		this.modalContext?.reject();
	}

	constructor() {
        super();
		console.log("from modal constructor");
	}

	connectedCallback() {
		super.connectedCallback();
		console.log("from modal connectedCallback");
	}

	render() {
		return html`
			<umb-body-layout headline="Edit Definition">
				<uui-box>
					<p>[EDIT]</p>
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._close}></uui-button>
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