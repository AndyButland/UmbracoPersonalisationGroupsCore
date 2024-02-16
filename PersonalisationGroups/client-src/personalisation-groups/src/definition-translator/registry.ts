import { ITranslator } from "../types.js"
import { DayOfWeekTranslator } from "./index.js";

export class TranslatorRegistry {
    private _translators: Array<ITranslator> = [];

    private _register(translator: ITranslator) {
        this._translators.push(translator);
    }

    getByAlias(alias: string) {
        const translatorsMatchingAlias = this._translators.filter(x => x.alias == alias);
        if (translatorsMatchingAlias.length > 0) {
            return translatorsMatchingAlias[0]
        }

        return null;
    }

    constructor() {
        // TODO: This doesn't feel right. Really we want to allow add-ons or solution to hook into this to register their own translators.
        this._register(new DayOfWeekTranslator);
    }
}
