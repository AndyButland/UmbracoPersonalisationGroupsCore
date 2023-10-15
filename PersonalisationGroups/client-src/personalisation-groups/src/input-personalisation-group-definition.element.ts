import { customElement, html, LitElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui';
import { GroupType, GroupDetailType, CriteriaType, TranslatorType } from "./types";

@customElement("umb-input-personalisation-group-definition")
export class UmbInputPersonalisationGroupDefinitionElement
    extends FormControlMixin(LitElement) {

    protected getFormElement() {
        return undefined;
    }

    @property()
    overlaySize?: UUIModalSidebarSize;

    @property({ attribute: false })
    set definition(data: GroupType) {
        data ??= { match: "All", duration: "Page", score: 50, details: []};;
        this._definition = data;
    }

    get definition() {
        return this._definition;
    }

    private _definition: GroupType = { match: "All", duration: "Page", score: 50, details: [] } ;

    @state()
    _availableCriteria: Array<CriteriaType> = []

    @state()
    _translators: { [alias: string]: TranslatorType; } = {};

    private async _getAvailableCriteria() {
        const response = await fetch("/App_Plugins/PersonalisationGroups/Criteria");
        const json = await response.json();
        this._availableCriteria = json;

        this._loadTranslators();
    }

    private _loadTranslators() {
        for (var i = 0; i < this._availableCriteria.length; i++) {
            const criteria = this._availableCriteria[i];
            const translatorPath = "/App_Plugins/" + criteria.clientAssetsFolder + "/" + this._convertToPascalCase(criteria.alias) + "/definition.translator.js";

            import(translatorPath)
                .then(translatorScript => {
                    this._translators[criteria.alias] = translatorScript;
                    this.requestUpdate();
                }).catch(() => {
                    console.log("Could not load translator for " + criteria.alias + " at " + translatorPath);
                });
        }
    }

    private _convertToPascalCase(s: string) {
        return s.charAt(0).toUpperCase() + s.substr(1);
    }

    private _getCriteriaName(alias: string) {
        var criteria = this._getCriteriaByAlias(alias);
        if (criteria) {
            return criteria.name;
        }

        return "";
    }

    private _getCriteriaByAlias(alias: string) {
        if (this._availableCriteria === undefined) {
            return null;
        }

        for (var i = 0; i < this._availableCriteria.length; i++) {
            if (this._availableCriteria[i].alias === alias) {
                return this._availableCriteria[i];
            }
        }

        return null;
    }

    private _getDefinitionTranslation(detail: GroupDetailType) {
        var translator = this._translators[detail.alias];
        if (translator) {
            return translator.translate(detail.definition);
        }

        return "";
    };

    private _addCriteria() {
        const selectedCriteriaAlias = (<HTMLSelectElement>this.shadowRoot?.getElementById("availableCriteriaSelect")).value;
        const newCriteria = <GroupDetailType>({ alias: selectedCriteriaAlias, definition: {} });

        this._definition.details.push(newCriteria)

        // this.value!.details.push(newCriteria) leads to: "Cannot add property 1, object is not extensible"
        // so have created a new object with the changes and set that to the value
        //const criteria = Object.assign([], this._definition.details);
        //criteria.push(newCriteria);
        //this._definition = <GroupType>{ match: this.value!.match, duration: this.value!.duration, score: this.value!.score, details: criteria };

        this._editCriteria(newCriteria);
    }

    private _editCriteria(criteria: GroupDetailType) {
        console.log(criteria);
    }

    private _removeCriteria(index: number) {
        this._definition.details.splice(index, 1);
        //const criteria = Object.assign([], this._definition.details);
        //criteria.splice(index, 1);
        //this._definition = <GroupType>{ match: this.value!.match, duration: this.value!.duration, score: this.value!.score, details: criteria };
    }
    
    constructor() {
        super();
        this._getAvailableCriteria();
    }

    render() {
        return html`<div>

                <div>
                    <label>Match:</label>
                    <select>
                        <option value="All" ?selected=${this._definition.match === "All"}>All</option>
                        <option value="Any" ?selected=${this._definition.match === "Any"}>Any</option>
                    </select>
                </div>

                <div>
                    <label>Duration:</label>
                    <select>
                        <option value="Page" ?selected=${this._definition.duration === "Page"}>Per page request</option>
                        <option value="Session" ?selected=${this._definition.duration === "Session"}>Per session</option>
                        <option value="Visitor" ?selected=${this._definition.duration === "Visitor"}>Per visitor</option>
                    </select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${this._definition.score ?? 50}" />
                    <div class="help-inline">
                        <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                    </div>
                </div>

                <div>
                    <label>Add Criteria:</label>
                    <div class="controls controls-row">
                        <select id="availableCriteriaSelect">
                            ${this._availableCriteria?.map((criteria) =>
                                html`<option value="${criteria.alias}">${criteria.name}</li>`
                            )}
                        </select>
                        <button type="button" @click=${() => this._addCriteria()}>Add</button>
                        <div class="help-inline">
                            <span></span>
                        </div>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Criteria</th>
                            <th>Definition</th>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        ${this._definition.details.map((detail: GroupDetailType, index: number) =>
                            html`<tr>
                                <td>${this._getCriteriaName(detail.alias)}</td>
                                <td>${this._getDefinitionTranslation(detail)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(detail)}>Edit</button>
                                    <button type="button" @click=${() => this._removeCriteria(index)}>Delete</button>
                                </td>
                            </tr>`
                        )}
                    </tbody>
                </table>

            </div>`;
    }
}

export default UmbInputPersonalisationGroupDefinitionElement;

declare global {
    interface HTMLElementTagNameMap {
        "umb-input-personalisation-group-definition": UmbInputPersonalisationGroupDefinitionElement;
    }
}