import { css, customElement, html, property, state, until, when } from "@umbraco-cms/backoffice/external/lit";
import { PersonalisationGroup, PersonalisationGroupDetail } from "../../types";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUIInputEvent, UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { CriteriaDto, CriteriaService } from "@personalisationgroups/generated";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { ManifestPersonalisationGroupDefinitionDetailTranslator, PersonalisationGroupDefinitionDetailTranslatorApi } from "../../translator/translator.interface";
import { loadManifestApi } from "@umbraco-cms/backoffice/extension-api";
import { UMB_MODAL_MANAGER_CONTEXT, umbConfirmModal } from "@umbraco-cms/backoffice/modal";
import { EDIT_DETAIL_DEFINITION_MODAL, EditDetailDefinitionModalValue } from "../../modal";

const elementName = "personalisation-group-definition-input";

@customElement(elementName)
export class PersonalisationGroupDefinitionInput extends UmbLitElement {

    constructor() {
      super();

      this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
        this.#modalContext = instance;
      });

      this.#translators = umbExtensionsRegistry.getAllExtensions()
        .filter(e => e.type === "PersonalisationGroupDetailDefinitionTranslator")
        .map(mt => mt as ManifestPersonalisationGroupDefinitionDetailTranslator);
    }

    @property({ attribute: false })
    set value(data: PersonalisationGroup) {
        // Need to create a new object here, as the incoming one is immutable.
        this.#value = {
            match: data.match ?? "All",
            duration: data.duration ?? "Page",
            score: data.score ?? 50,
            details: data.details ? [...data.details] : []
        };
    }

    get value() {
        return this.#value;
    }

    #value: PersonalisationGroup = { match: "All", duration: "Page", score: 50, details: [] };

    #modalContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;

    @state()
    private _availableCriteria: Array<CriteriaDto> = [];

    @state()
    private _selectedCriteria?: CriteriaDto = undefined;

    #translators: Array<ManifestPersonalisationGroupDefinitionDetailTranslator> = [];

    async connectedCallback() {
        super.connectedCallback();
        await this.#getAvailableCriteria();
    }

    async #getAvailableCriteria() {
        const { data } = await tryExecute(this, CriteriaService.getCriteriaCollection());
        this._availableCriteria = data;
        this._selectedCriteria = this._availableCriteria.length > 0
            ? this._availableCriteria[0]
            : undefined;
    }

    #getCriteriaName(alias: string) {
        var criteria = this.#getCriteriaByAlias(alias);
        if (criteria) {
            return criteria.name;
        }

        return "";
    }

    #getCriteriaByAlias(alias: string) {
        if (this._availableCriteria === undefined) {
            return undefined;
        }

        return this._availableCriteria.find(c => c.alias === alias);
    }

    #getMatchOptions() {
        return [{
            name: "All",
            value: "All",
            selected: this.#value.match === "All",
        },
        {
            name: "Any",
            value: "Any",
            selected: this.#value.match === "Any",
        }];
    }

    #onMatchChange(e: UUISelectEvent) {
        this.#value.match = e.target.value.toString();
        this.#dispatchChangeEvent();
    }

    #getDurationOptions() {
        return [{
            name: "Per page request",
            value: "Page",
            selected: this.#value.duration === "Page",
        },
        {
            name: "Per session",
            value: "Session",
            selected: this.#value.duration === "Session",
        },
        {
            name: "Per visitor",
            value: "Visitor",
            selected: this.#value.duration === "Visitor",
        }];
    }

    #onDurationChange(e: UUISelectEvent) {
        this.#value.duration = e.target.value.toString();
        this.#dispatchChangeEvent();
    }

    #onScoreChange(e: UUIInputEvent) {
        this.#value.score = parseInt(e.target.value.toString());
        this.#dispatchChangeEvent();
    }

    #getAvailableCriteriaOptions() {
        return this._availableCriteria?.map((c) => {
            return {
                name: c.name,
                value: c.alias,
                selected: c.alias === this._selectedCriteria?.alias,
            }
        }) ?? [];
    }

    #onSelectedCriteriaChange(e: UUISelectEvent) {
        const alias = e.target.value.toString();
        this._selectedCriteria = this.#getCriteriaByAlias(alias);
    }

    #dispatchChangeEvent() {
        this.requestUpdate();
        this.dispatchEvent(
          new CustomEvent("change", { composed: true, bubbles: true })
        );
      }

    #addCriteria() {
        if (!this._selectedCriteria) {
            return;
        }

        const newGroupDetail = <PersonalisationGroupDetail>({ alias: this._selectedCriteria?.alias, definition: "" });
        this.#value.details.push(newGroupDetail);
        this.#dispatchChangeEvent();

        this.#editCriteria(this.#value.details.length - 1);
    }

    #editCriteria(index: number) {
        if (!this.#modalContext) {
            return;
        }

        const detail = this.#value.details[index];
        const criteria = this.#getCriteriaByAlias(detail.alias);
        if (!criteria) {
            throw new Error("Could not find criteria with alias: " + detail.alias);
        }

        const modalHandler = this.#modalContext.open(
            this,
            EDIT_DETAIL_DEFINITION_MODAL,
            {
              data: {
                criteriaName: criteria.name,
                propertyEditorUiAlias: `PersonalisationGroups.PropertyEditorUi.${criteria.alias}Criteria`
              },
              value: {
                detail
              },
            }
          );

          modalHandler.onSubmit()
            .then((v: EditDetailDefinitionModalValue) => {
                this.#value.details[index] = v.detail;
                this.#dispatchChangeEvent();
            })
            .catch(() => undefined);
    }

     async #removeCriteria(index: number) {
        await umbConfirmModal(this, {
            headline: "Remove criteria",
            content: "Are you sure you wish to remove the selected criteria?",
            confirmLabel: this.localize.term("general_yes"),
            color: "danger",
          });
        this.#value.details.splice(index, 1);
        this.#dispatchChangeEvent();
    }

    async #translateDetailDefinition(detail: PersonalisationGroupDetail) {
        const translator = this.#translators.find(t => t.criteriaAlias === detail.alias);
        if (!translator) {
            return "";
        }

        const api = await loadManifestApi(translator.api);
        if (api) {
          const apiInstance = new api() as PersonalisationGroupDefinitionDetailTranslatorApi;
          if (apiInstance) {
            return apiInstance.translate(detail.definition);
          }
        }

        return "";
    }

    render() {
        return html`<div>

                <table class="group-settings">
                    <tr>
                        <td class="label"><label for="Match">Match:</label></td>
                        <td>
                            <uui-select
                                id="Match"
                                label="Match"
                                @change=${this.#onMatchChange}
                                .options=${this.#getMatchOptions()}
                            ></uui-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label"><label for="Duration">Duration:</label></td>
                        <td>
                            <uui-select
                                id="Duration"
                                label="Duration"
                                @change=${this.#onDurationChange}
                                .options=${this.#getDurationOptions()}
                            ></uui-select>
                            <div class="help-inline">
                                <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="label"><label for="Score">Score:</label></td>
                        <td>
                            <uui-input
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                id="Score"
                                label="Score"
                                .value=${this.#value.score}
                                @change=${this.#onScoreChange}
                            ></uui-input>
                            <div class="help-inline">
                                <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="label"><label for="Criteria">Add Criteria:</label></td>
                        <td>
                            <uui-select
                                id="Criteria"
                                label="Criteria"
                                @change=${this.#onSelectedCriteriaChange}
                                .options=${this.#getAvailableCriteriaOptions()}
                            ></uui-select>
                            <uui-button
                                label="Add"
                                look="outline"
                                @click=${this.#addCriteria}
                            ></uui-button>
                            ${when(this._selectedCriteria,
                                () => html`
                                    <div class="help-inline">
                                        <span>${this._selectedCriteria!.description}</span>
                                    </div>`)}

                        </td>
                    </tr>
                </table>

                <uui-table>
                    <uui-table-head>
                        <uui-table-head-cell>Criteria</uui-table-head-cell>
                        <uui-table-head-cell>Definition</uui-table-head-cell>
                        <uui-table-head-cell></uui-table-head-cell>
                    </uui-table-head>
                    ${this.#value.details.map((detail: PersonalisationGroupDetail, index: number) =>
                        html`<uui-table-row>
                            <uui-table-cell>${this.#getCriteriaName(detail.alias)}</uui-table-cell>
                            <uui-table-cell>
                                ${until(
                                    this.#translateDetailDefinition(detail).then((t) => html`${t}`),
                                    html``,
                                )}
                            </uui-table-cell>
                            <uui-table-cell>
                                <uui-button
                                    label="Edit"
                                    look="outline"
                                    @click=${() => this.#editCriteria(index)}
                                ></uui-button>
                                <uui-button
                                    label="Delete"
                                    look="outline"
                                    color="danger"
                                    @click=${() => this.#removeCriteria(index)}
                                ></uui-button>
                            </uui-table-cell>
                        </uui-table-row>`
                    )}
                </uui-table>

            </div>`;
    }

    static styles = [
        css`
          table.group-settings td {
            vertical-align: top;
            padding-right: 10px;
          }

          table.group-settings td.label {
            padding-top: 4px;
          }

          .help-inline {
            margin: 4px;
            font-size: 12px;
            color: var(--uui-color-text-alt);
          }
        `,
      ];
}

export default PersonalisationGroupDefinitionInput;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: PersonalisationGroupDefinitionInput;
    }
}