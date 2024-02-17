import { customElement, html, LitElement, property } from '@umbraco-cms/backoffice/external/lit';
import { GroupDetailType } from "../../types";
import { EditorRegistry } from "../../definition-editor/registry";

@customElement('umb-personalisation-group-definition-editor-modal-detail')
export class UmbPersonalisationGroupDefinitionEditorModalDetailElement extends LitElement {

	@property({ attribute: true })
	detail: GroupDetailType = { alias: "", definition: "" };

	private _editorRegistry: EditorRegistry;

	private _renderEditor() {
        var editor = this._editorRegistry.getByAlias(this.detail.alias);
		if (editor) {
			console.log(editor);
			editor.loadDefinition(this.detail.definition);
			console.log(editor);
			return editor?.render();
		}
	}

	constructor() {
        super();
		this._editorRegistry = new EditorRegistry();
	}

	render() {
		return html`${this._renderEditor()}`;
	}
}

export default UmbPersonalisationGroupDefinitionEditorModalDetailElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-personalisation-group-definition-editor-modal-detail': UmbPersonalisationGroupDefinitionEditorModalDetailElement;
	}
}