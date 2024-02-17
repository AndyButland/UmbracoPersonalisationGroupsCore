import { html, customElement, state, unsafeHTML } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { GroupDetailType, PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue } from "../../types";
import { EditorRegistry } from "../../definition-editor/registry";

@customElement('umb-personalisation-group-definition-editor-modal')
export class UmbPersonalisationGroupDefinitionEditorModalElement extends UmbModalBaseElement<PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue> {


	@state()
	_index: number | null = null;

	@state()
	_detail: GroupDetailType = { alias: "", definition: "" };

	private _editorRegistry: EditorRegistry;

	private _renderEditor() {
        var editor = this._editorRegistry.getByAlias(this._detail.alias);
		if (editor) {
			editor.loadDefinition(this._detail.definition);
			return editor?.render();
		}

		return "";
	}

	private _submit() {
		var editor = this._editorRegistry.getByAlias(this._detail.alias);
		if (editor) {
			this.connectedCallback();
			var editorNode = this.shadowRoot?.getElementById("definition-editor");
			if (editorNode) {
				console.log(editorNode.innerHTML);
 				//console.log(editor.readDefinition(editorNode));
			}
		}

		this._submitModal();
	}

	constructor() {
        super();
		this._editorRegistry = new EditorRegistry();
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
					${unsafeHTML(this._renderEditor())}
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