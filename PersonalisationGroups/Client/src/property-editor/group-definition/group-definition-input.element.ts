import { customElement, html, property, state, when } from "@umbraco-cms/backoffice/external/lit";
import { GroupType, GroupDetailType } from "../../types";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UUISelectEvent } from "@umbraco-cms/backoffice/external/uui";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { CriteriaDto, CriteriaService } from "@personalisationgroups/generated";

const elementName = "personalisation-group-definition-input";

@customElement(elementName)
export class PersonalisationGroupDefinitionInput extends UmbLitElement {

    @property({ attribute: false })
    set value(data: GroupType) {
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

    #value: GroupType = { match: "All", duration: "Page", score: 50, details: [] };

    @state()
    private _availableCriteria: Array<CriteriaDto> = [];

    @state()
    private _selectedCriteria?: CriteriaDto = undefined;

    async connectedCallback() {
        super.connectedCallback();
        await this.#getAvailableCriteria();
    }

    async #getAvailableCriteria() {
        const { data } = await tryExecute(CriteriaService.getCollection());
        this._availableCriteria = data || [];
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

        const newGroupDetail = <GroupDetailType>({ alias: this._selectedCriteria?.alias, definition: {} });
        this.#value.details.push(newGroupDetail);
        this.#dispatchChangeEvent();

        this.#editCriteria(this.#value.details.length - 1);
    }

    #editCriteria(index: number) {
        console.log("edit: " + index);
    }

     #removeCriteria(index: number) {
        this.#value.details.splice(index, 1);
        this.#dispatchChangeEvent();
    }

    render() {
        return html`<div>

                <div>
                    <label>Match:</label>
                    <uui-select
                        name="match"
                        @change=${this.#onMatchChange}
                        .options=${this.#getMatchOptions()}
                    ></uui-select>
                </div>

                <div>
                    <label>Duration:</label>
                    <uui-select
                        name="duration"
                        @change=${this.#onDurationChange}
                        .options=${this.#getDurationOptions()}
                    ></uui-select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${this.#value.score ?? 50}" />
                    <div class="help-inline">
                        <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                    </div>
                </div>

                <div>
                    <label>Add Criteria:</label>
                    <div class="controls controls-row">
                        <uui-select
                            name="criteria"
                            @change=${this.#onSelectedCriteriaChange}
                            .options=${this.#getAvailableCriteriaOptions()}
                        ></uui-select>
                        <button type="button" @click=${this.#addCriteria}>Add</button>
                        ${when(this._selectedCriteria,
                            () => html`
                                <div class="help-inline">
                                    <span>${this._selectedCriteria!.description}</span>
                                </div>`)}

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
                        ${this.#value.details.map((detail: GroupDetailType, index: number) =>
                            html`<tr>
                                <td>${this.#getCriteriaName(detail.alias)}</td>
                                <td>[translation]</td>
                                <td>
                                    <button type="button" @click=${() => this.#editCriteria(index)}>Edit</button>
                                    <button type="button" @click=${() => this.#removeCriteria(index)}>Delete</button>
                                </td>
                            </tr>`
                        )}
                    </tbody>
                </table>

            </div>`;
    }
}

export default PersonalisationGroupDefinitionInput;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: PersonalisationGroupDefinitionInput;
    }
}