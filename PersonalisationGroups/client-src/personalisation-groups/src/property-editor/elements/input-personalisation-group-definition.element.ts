import { customElement, html, LitElement, property, state } from "@umbraco-cms/backoffice/external/lit";
import { FormControlMixin } from '@umbraco-cms/backoffice/external/uui';
import type { UUIModalSidebarSize } from '@umbraco-cms/backoffice/external/uui';
import { UmbModalRouteRegistrationController } from '@umbraco-cms/backoffice/modal';
import { GroupType, GroupDetailType, CriteriaType, TranslatorType, PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL } from "../../types";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";


@customElement("umb-input-personalisation-group-definition")
export class UmbInputPersonalisationGroupDefinitionElement
    extends FormControlMixin(UmbElementMixin(LitElement)) {

    // Necessary to add these as the first parameter of the UmbModalRouteRegistrationController constructor expects them.
    protected getFormElement() { return undefined; }

    @property()
    overlaySize?: UUIModalSidebarSize;

    @property({ attribute: false })
    set definition(data: GroupType) {
        // Need to create a new object here, as the incoming one is immutable.
        this._definition = {
            match: data.match,
            duration: data.duration,
            score: data.score,
            details: [...data.details]
        };
    }

    get definition() {
        return this._definition;
    }

    private _definition: GroupType = { match: "All", duration: "Page", score: 50, details: [] };

    @state()
    private _availableCriteria: Array<CriteriaType> = [];

    @state()
    private _translators: { [alias: string]: TranslatorType; } = {};

    private _myModalRegistration;

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
        const newGroupDetail = <GroupDetailType>({ alias: selectedCriteriaAlias, definition: {} });

        this.definition.details.push(newGroupDetail);
        this.requestUpdate();

        this._editCriteria(this.definition.details.length - 1);
    }

    private _editCriteria(index: number) {
        this._myModalRegistration.open({ index });
    }

    private _removeCriteria(index: number) {
        this.definition.details.splice(index, 1);
        this.requestUpdate();
    }

    constructor() {
        super();
        this._getAvailableCriteria();
        this._myModalRegistration = new UmbModalRouteRegistrationController(this, PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL)
            .addAdditionalPath(`:index`)
            .onSetup((params) => {
                // Get index:
                const indexParam = params.index;
                if (!indexParam) return false;
                let index: number | null = parseInt(params.index);
                if (Number.isNaN(index)) return false;

                // Use the index to find data:
                const data = this.definition.details[index];
                console.log(data);

                return {
                    data:{
                        index: index,
                        config: {
                            overlaySize: this.overlaySize || 'small',
                        }
                    },
                    value:{
                        definition: {
                            alias: data.definition.alias,
                            match: data.definition.match,
                            value: data.definition.value
                        }
                    }
                };
            })
            .onSubmit((submitData) => {
                if (!submitData) return;
                console.log(submitData);
            });
    }

    render() {
        return html`<div>

                <div>
                    <label>Match:</label>
                    <select>
                        <option value="All" ?selected=${this.definition.match === "All"}>All</option>
                        <option value="Any" ?selected=${this._definition.match === "Any"}>Any</option>
                    </select>
                </div>

                <div>
                    <label>Duration:</label>
                    <select>
                        <option value="Page" ?selected=${this.definition.duration === "Page"}>Per page request</option>
                        <option value="Session" ?selected=${this.definition.duration === "Session"}>Per session</option>
                        <option value="Visitor" ?selected=${this.definition.duration === "Visitor"}>Per visitor</option>
                    </select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${this.definition.score ?? 50}" />
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
                        ${this.definition.details.map((detail: GroupDetailType, index: number) =>
                            html`<tr>
                                <td>${this._getCriteriaName(detail.alias)}</td>
                                <td>${this._getDefinitionTranslation(detail)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(index)}>Edit</button>
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