import { customElement, LitElement, html, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorUiElement } from "@umbraco-cms/backoffice/extension-registry";
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui'
import { GroupType } from "../../types";
import { UmbInputPersonalisationGroupDefinitionElement } from './input-personalisation-group-definition.element';

@customElement("umb-property-editor-ui-personalisation-group-definition")
export class UmbPropertyEditorPersonalisationGroupDefinitionElement
    extends LitElement
    implements UmbPropertyEditorUiElement  {

    @property({ type: Object })
    value:
        | GroupType
        | undefined = undefined;

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection | undefined) {
        this._overlaySize = config?.getValueByAlias('overlaySize');
    }

    @state()
    private _overlaySize?: UUIModalSidebarSize;

    private _onChange(event: CustomEvent) {
        this.value = (event.target as UmbInputPersonalisationGroupDefinitionElement).definition;
        this.dispatchEvent(new CustomEvent('property-value-change'));
    }

    render() {
        return html`<umb-input-personalisation-group-definition
			@change="${this._onChange}"
			.overlaySize="${this._overlaySize}"
			.definition="${this.value ?? {}}"></umb-input-personalisation-group-definition>`;
    }
}

export default UmbPropertyEditorPersonalisationGroupDefinitionElement;

declare global {
    interface HTMLElementTagNameMap {
        "umb-property-editor-ui-personalisation-group-definition": UmbPropertyEditorPersonalisationGroupDefinitionElement;
    }
}