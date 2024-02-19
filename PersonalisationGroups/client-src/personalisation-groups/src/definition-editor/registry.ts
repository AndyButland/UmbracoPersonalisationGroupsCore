import { IDefinitionEditor } from "../types.js"
import { DayOfWeekEditor } from "./index.js";

export class EditorRegistry {
    private _editors: Array<IDefinitionEditor> = [];

    constructor() {
        // TODO: This doesn't feel right. Really we want to allow add-ons or solution to hook into this to register their own translators.
        this._editors.push(new DayOfWeekEditor);
    }
}
