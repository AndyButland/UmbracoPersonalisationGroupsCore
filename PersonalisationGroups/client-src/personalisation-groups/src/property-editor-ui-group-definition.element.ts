import { customElement, LitElement, html, property, state } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorExtensionElement } from "@umbraco-cms/backoffice/extension-registry";
import { GroupType, GroupDetailType, CriteriaType, TranslatorType } from "./types";

@customElement("property-editor-ui-group-definition")
export class PropertyEditorGroupDefinitionElement
    extends LitElement
    implements UmbPropertyEditorExtensionElement {

        @property({ type: Object })
        value:
            | GroupType
            | undefined = undefined;

        @state()
        _availableCriteria: Array<CriteriaType> = []

        @state()
        _translators: { [alias: string] : TranslatorType; } = {};

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

        private _getDefinitionTranslation (detail: GroupDetailType) {
            console.log(detail);
            console.log(this._translators);
            var translator = this._translators[detail.alias];
            console.log(translator);
            if (translator) {
                return translator.translate(detail.definition);
            }

            return "";
        };

        constructor() {
            super();
            this._getAvailableCriteria();
        }

        render() {
            return html`<div>

                <div>
                    <label>Match:</label>
                    <select>
                        <option value="All" ?selected=${this.value?.match === "All"}>All</option>
                        <option value="Any" ?selected=${this.value?.match === "Any"}>Any</option>
                    </select>
                </div>

                <div>
                    <label>Duration:</label>
                    <select>
                        <option value="Page" ?selected=${this.value?.duration === "Page"}>Per page request</option>
                        <option value="Session" ?selected=${this.value?.duration === "Session"}>Per session</option>
                        <option value="Visitor" ?selected=${this.value?.duration === "Visitor"}>Per visitor</option>
                    </select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${this.value?.score ?? 50}" />
                    <div class="help-inline">
                        <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                    </div>
                </div>

                <div>
                    <label>Add Criteria:</label>
                    <div class="controls controls-row">
                        <select>
                        ${this._availableCriteria?.map((criteria) =>
                            html`<option value="${criteria.alias}">${criteria.name}</li>`
                          )}
                        </select>
                        <button type="button">Add</button>
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
                        ${this.value?.details.map((detail) =>
                            html`<tr>
                                <td>${this._getCriteriaName(detail.alias)}</td>
                                <td>${this._getDefinitionTranslation(detail)}</td>
                                <td>
                                    <button type="button" ng-click="editDefinitionDetail(detail)">Edit</button>
                                    <button type="button" ng-click="delete($index)">Delete</button>
                                </td>
                            </tr>`
                        )}

                    </tbody>
                </table>

            </div>`;
        }
}

export default PropertyEditorGroupDefinitionElement;

declare global {
    interface HTMLElementTagNameMap {
        "property-editor-ui-group-definition": PropertyEditorGroupDefinitionElement;
    }
}