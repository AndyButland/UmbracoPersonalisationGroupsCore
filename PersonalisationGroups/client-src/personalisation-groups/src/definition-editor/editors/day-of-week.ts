import { customElement, LitElement, html } from '@umbraco-cms/backoffice/external/lit';
import { IDefinitionEditor } from "../../types.js"
import { UmbElementMixin } from '@umbraco-cms/backoffice/element-api';

@customElement('umb-personalisation-group-definition-editor-day-of-week')
export class DayOfWeekEditor extends UmbElementMixin(LitElement) implements IDefinitionEditor {
    alias: string = "dayOfWeek";

    static get properties() { return { definition: { type: String, attribute: true } }; }

    set definition(value: string) {
        this._definition = value;
        if (value) {
            this._typedDefinition = eval(value);
        }
    }
    get definition() { return this._definition;  }

    private _definition: string = "";
    private _typedDefinition: Array<number> = [];

    private _isSelected(index: number) {
        const isSelected = this._typedDefinition.indexOf(index) > -1;
        return isSelected;
    }

    render() {
        return html`<div id="definition-editor">
            <p>Please select the days for which this group will be valid:</p>

            <table>
                <tr><td>Sunday: </td><td><input type="checkbox" ?checked="${this._isSelected(1)}" /></td></tr>
                <tr><td>Monday: </td><td><input type="checkbox" ?checked="${this._isSelected(2)}" /></td></tr>
                <tr><td>Tuesday: </td><td><input type="checkbox" ?checked="${this._isSelected(3)}" /></td></tr>
                <tr><td>Wednesday: </td><td><input type="checkbox" ?checked="${this._isSelected(4)}" /></td></tr>
                <tr><td>Thursday: </td><td><input type="checkbox" ?checked="${this._isSelected(5)}" /></td></tr>
                <tr><td>Friday: </td><td><input type="checkbox" ?checked="${this._isSelected(6)}" /></td></tr>
                <tr><td>Saturday: </td><td><input type="checkbox" ?checked="${this._isSelected(7)}" /></td></tr>
            </table>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'umb-personalisation-group-definition-editor-day-of-week': DayOfWeekEditor;
    }
}

