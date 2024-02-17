import { IDefinitionEditor } from "../../types.js"

export class DayOfWeekEditor implements IDefinitionEditor {
    alias: string = "dayOfWeek";

    private _definition: Array<number> = [];

    loadDefinition(definition: string) {
        this._definition = eval(definition);
    }

    readDefinition(editorNode: HTMLElement) {

        var checkboxes = editorNode.querySelectorAll('input[type=checkbox]');
        for (let i = 0; i < checkboxes.length; i++) {
            const checkbox = checkboxes[i];
            console.log(checkbox);  // TODO: These don't contain user input.
        }

        return JSON.stringify(this._definition);
    }

    private _isSelected(index: number) {
        return this._definition.indexOf(index) > -1;
    }

    render() {
        return `<div id="definition-editor">
            <p>Please select the days for which this group will be valid:</p>

            <table>
                <tr><td>Sunday: </td><td><input type="checkbox" ${this._isSelected(1) ? "checked" : ""}/></td></tr>
                <tr><td>Monday: </td><td><input type="checkbox" ${this._isSelected(2) ? "checked" : ""} /></td></tr>
                <tr><td>Tuesday: </td><td><input type="checkbox" ${this._isSelected(3) ? "checked" : ""} /></td></tr>
                <tr><td>Wednesday: </td><td><input type="checkbox" ${this._isSelected(4) ? "checked" : ""} /></td></tr>
                <tr><td>Thursday: </td><td><input type="checkbox" ${this._isSelected(5) ? "checked" : ""} /></td></tr>
                <tr><td>Friday: </td><td><input type="checkbox" ${this._isSelected(6) ? "checked" : ""} /></td></tr>
                <tr><td>Saturday: </td><td><input type="checkbox" ${this._isSelected(7) ? "checked" : ""} /></td></tr>
            </table>
        </div>`;
    }
}

