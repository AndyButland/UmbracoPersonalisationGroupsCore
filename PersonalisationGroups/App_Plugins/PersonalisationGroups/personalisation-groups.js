import { LitElement as v, html as p, property as u, state as c, customElement as f } from "@umbraco-cms/backoffice/external/lit";
import { FormControlMixin as _ } from "@umbraco-cms/backoffice/external/uui";
import { UmbModalToken as m, UmbModalRouteRegistrationController as b } from "@umbraco-cms/backoffice/modal";
import { UmbElementMixin as g } from "@umbraco-cms/backoffice/element-api";
const C = new m(
  "Umb.Modal.PersonalisationGroupDetailDefinition",
  {
    type: "sidebar",
    size: "small"
  }
);
var y = Object.defineProperty, P = Object.getOwnPropertyDescriptor, d = (t, i, e, a) => {
  for (var r = a > 1 ? void 0 : a ? P(i, e) : i, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (r = (a ? o(i, e, r) : o(r)) || r);
  return a && r && y(i, e, r), r;
};
let s = class extends _(g(v)) {
  constructor() {
    super(), this._definition = { match: "All", duration: "Page", score: 50, details: [] }, this._availableCriteria = [], this._translators = {}, this._getAvailableCriteria(), this._myModalRegistration = new b(this, C).addAdditionalPath(":index").onSetup((t) => {
      if (!t.index)
        return !1;
      let e = parseInt(t.index);
      if (Number.isNaN(e))
        return !1;
      const a = this.definition.details[e];
      return console.log(a), {
        index: e,
        definition: {
          alias: a.definition.alias,
          match: a.definition.match,
          value: a.definition.value
        },
        config: {
          overlaySize: this.overlaySize || "small"
        }
      };
    }).onSubmit((t) => {
      t && console.log(t);
    });
  }
  // Necessary to add these as the first parameter of the UmbModalRouteRegistrationController constructor expects them.
  getFormElement() {
  }
  set definition(t) {
    this._definition = {
      match: t.match,
      duration: t.duration,
      score: t.score,
      details: [...t.details]
    };
  }
  get definition() {
    return this._definition;
  }
  async _getAvailableCriteria() {
    const i = await (await fetch("/App_Plugins/PersonalisationGroups/Criteria")).json();
    this._availableCriteria = i, this._loadTranslators();
  }
  _loadTranslators() {
    for (var t = 0; t < this._availableCriteria.length; t++) {
      const i = this._availableCriteria[t], e = "/App_Plugins/" + i.clientAssetsFolder + "/" + this._convertToPascalCase(i.alias) + "/definition.translator.js";
      import(e).then((a) => {
        this._translators[i.alias] = a, this.requestUpdate();
      }).catch(() => {
        console.log("Could not load translator for " + i.alias + " at " + e);
      });
    }
  }
  _convertToPascalCase(t) {
    return t.charAt(0).toUpperCase() + t.substr(1);
  }
  _getCriteriaName(t) {
    var i = this._getCriteriaByAlias(t);
    return i ? i.name : "";
  }
  _getCriteriaByAlias(t) {
    if (this._availableCriteria === void 0)
      return null;
    for (var i = 0; i < this._availableCriteria.length; i++)
      if (this._availableCriteria[i].alias === t)
        return this._availableCriteria[i];
    return null;
  }
  _getDefinitionTranslation(t) {
    var i = this._translators[t.alias];
    return i ? i.translate(t.definition) : "";
  }
  _addCriteria() {
    var e;
    const i = { alias: ((e = this.shadowRoot) == null ? void 0 : e.getElementById("availableCriteriaSelect")).value, definition: {} };
    this.definition.details.push(i), this.requestUpdate(), this._editCriteria(this.definition.details.length - 1);
  }
  _editCriteria(t) {
    console.log(t), this._myModalRegistration.open({ index: t });
  }
  _removeCriteria(t) {
    this.definition.details.splice(t, 1), this.requestUpdate();
  }
  render() {
    var t;
    return p`<div>

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
                            ${(t = this._availableCriteria) == null ? void 0 : t.map(
      (i) => p`<option value="${i.alias}">${i.name}</li>`
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
                        ${this.definition.details.map(
      (i, e) => p`<tr>
                                <td>${this._getCriteriaName(i.alias)}</td>
                                <td>${this._getDefinitionTranslation(i)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(e)}>Edit</button>
                                    <button type="button" @click=${() => this._removeCriteria(e)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
d([
  u()
], s.prototype, "overlaySize", 2);
d([
  u({ attribute: !1 })
], s.prototype, "definition", 1);
d([
  c()
], s.prototype, "_availableCriteria", 2);
d([
  c()
], s.prototype, "_translators", 2);
s = d([
  f("umb-input-personalisation-group-definition")
], s);
var A = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, h = (t, i, e, a) => {
  for (var r = a > 1 ? void 0 : a ? $(i, e) : i, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (r = (a ? o(i, e, r) : o(r)) || r);
  return a && r && A(i, e, r), r;
};
let l = class extends v {
  constructor() {
    super(), this.value = void 0;
  }
  set config(t) {
    this._overlaySize = t == null ? void 0 : t.getValueByAlias("overlaySize");
  }
  _onChange(t) {
    this.value = t.target.definition, this.dispatchEvent(new CustomEvent("property-value-change"));
  }
  render() {
    return p`<umb-input-personalisation-group-definition
			@change="${this._onChange}"
			.overlaySize="${this._overlaySize}"
			.definition="${this.value ?? {}}"></umb-input-personalisation-group-definition>`;
  }
};
h([
  u({ type: Object })
], l.prototype, "value", 2);
h([
  u({ attribute: !1 })
], l.prototype, "config", 1);
h([
  c()
], l.prototype, "_overlaySize", 2);
l = h([
  f("umb-property-editor-ui-personalisation-group-definition")
], l);
const E = {
  UmbPropertyEditorPersonalisationGroupDefinitionElement: l,
  UmbInputPersonalisationGroupDefinitionElement: s
};
export {
  l as UmbPropertyEditorPersonalisationGroupDefinitionElement,
  E as default
};
//# sourceMappingURL=personalisation-groups.js.map
