import { html, customElement, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { GroupDetailType, PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue } from "../../types";
import { EditorRegistry } from "../../definition-editor/registry";

@customElement('umb-personalisation-group-definition-editor-modal')
export class UmbPersonalisationGroupDefinitionEditorModalElement extends UmbModalBaseElement<PersonalisationGroupDefinitionEditorModalData, PersonalisationGroupDefinitionEditorModalValue> {

    @state()
    _index: number | null = null;

    @state()
    _detail: GroupDetailType = { alias: "", definition: "" };

    private _renderEditor() {
        const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
        const tagName = "umb-personalisation-group-definition-editor-" + camelToSnakeCase(this._detail.alias);
        const el = document.createElement(tagName);
        el.setAttribute("definition", this._detail.definition);
        return html`${el}`;
    }

    private _submit() {
        this._submitModal();
    }

    constructor() {
        super();
        // TODO: Seems we need to load this registry, why?
        const editorRegistry = new EditorRegistry();
        console.log(editorRegistry);
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
                    ${this._renderEditor()}
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