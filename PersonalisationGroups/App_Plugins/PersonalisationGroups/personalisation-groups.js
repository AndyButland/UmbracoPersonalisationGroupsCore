import { LitElement as c, html as p, property as u, state as v, customElement as _ } from "@umbraco-cms/backoffice/external/lit";
import { FormControlMixin as b } from "@umbraco-cms/backoffice/external/uui";
var f = Object.defineProperty, m = Object.getOwnPropertyDescriptor, d = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? m(e, i) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (r ? o(e, i, a) : o(a)) || a);
  return r && a && f(e, i, a), a;
};
let s = class extends b(c) {
  constructor() {
    super(), this._definition = { match: "All", duration: "Page", score: 50, details: [] }, this._availableCriteria = [], this._translators = {}, this._getAvailableCriteria();
  }
  getFormElement() {
  }
  set definition(t) {
    t ?? (t = { match: "All", duration: "Page", score: 50, details: [] }), this._definition = t;
  }
  get definition() {
    return this._definition;
  }
  async _getAvailableCriteria() {
    const e = await (await fetch("/App_Plugins/PersonalisationGroups/Criteria")).json();
    this._availableCriteria = e, this._loadTranslators();
  }
  _loadTranslators() {
    for (var t = 0; t < this._availableCriteria.length; t++) {
      const e = this._availableCriteria[t], i = "/App_Plugins/" + e.clientAssetsFolder + "/" + this._convertToPascalCase(e.alias) + "/definition.translator.js";
      import(i).then((r) => {
        this._translators[e.alias] = r, this.requestUpdate();
      }).catch(() => {
        console.log("Could not load translator for " + e.alias + " at " + i);
      });
    }
  }
  _convertToPascalCase(t) {
    return t.charAt(0).toUpperCase() + t.substr(1);
  }
  _getCriteriaName(t) {
    var e = this._getCriteriaByAlias(t);
    return e ? e.name : "";
  }
  _getCriteriaByAlias(t) {
    if (this._availableCriteria === void 0)
      return null;
    for (var e = 0; e < this._availableCriteria.length; e++)
      if (this._availableCriteria[e].alias === t)
        return this._availableCriteria[e];
    return null;
  }
  _getDefinitionTranslation(t) {
    var e = this._translators[t.alias];
    return e ? e.translate(t.definition) : "";
  }
  _addCriteria() {
    var i;
    const e = { alias: ((i = this.shadowRoot) == null ? void 0 : i.getElementById("availableCriteriaSelect")).value, definition: {} };
    this.definition.score = 100, this.definition.details.push(e), this._editCriteria(e);
  }
  _editCriteria(t) {
    console.log(t);
  }
  _removeCriteria(t) {
    this.definition.details.splice(t, 1);
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
      (e) => p`<option value="${e.alias}">${e.name}</li>`
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
      (e, i) => p`<tr>
                                <td>${this._getCriteriaName(e.alias)}</td>
                                <td>${this._getDefinitionTranslation(e)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(e)}>Edit</button>
                                    <button type="button" @click=${() => this._removeCriteria(i)}>Delete</button>
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
  v()
], s.prototype, "_availableCriteria", 2);
d([
  v()
], s.prototype, "_translators", 2);
s = d([
  _("umb-input-personalisation-group-definition")
], s);
var C = Object.defineProperty, g = Object.getOwnPropertyDescriptor, h = (t, e, i, r) => {
  for (var a = r > 1 ? void 0 : r ? g(e, i) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (a = (r ? o(e, i, a) : o(a)) || a);
  return r && a && C(e, i, a), a;
};
let l = class extends c {
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
  v()
], l.prototype, "_overlaySize", 2);
l = h([
  _("umb-property-editor-ui-personalisation-group-definition")
], l);
const A = {
  UmbPropertyEditorPersonalisationGroupDefinitionElement: l,
  UmbInputPersonalisationGroupDefinitionElement: s
};
export {
  l as UmbPropertyEditorPersonalisationGroupDefinitionElement,
  A as default
};
//# sourceMappingURL=personalisation-groups.js.map
