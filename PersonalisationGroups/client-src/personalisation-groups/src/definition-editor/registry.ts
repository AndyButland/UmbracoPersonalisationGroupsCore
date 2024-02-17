import { IDefinitionEditor } from "../types.js"
import { DayOfWeekEditor } from "./index.js";

export class EditorRegistry {
    private _editors: Array<IDefinitionEditor> = [];

    private _register(editor: IDefinitionEditor) {
        this._editors.push(editor);
    }

    getByAlias(alias: string) {
        const translatorsMatchingAlias = this._editors.filter(x => x.alias == alias);
        if (translatorsMatchingAlias.length > 0) {
            return translatorsMatchingAlias[0]
        }

        return null;
    }

    constructor() {
        // TODO: This doesn't feel right. Really we want to allow add-ons or solution to hook into this to register their own translators.
        this._register(new DayOfWeekEditor);
    }
}
