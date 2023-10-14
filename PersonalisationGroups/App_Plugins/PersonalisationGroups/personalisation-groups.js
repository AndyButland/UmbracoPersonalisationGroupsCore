import { property as p, state as v, customElement as b, LitElement as _, html as d } from "@umbraco-cms/backoffice/external/lit";
var C = Object.defineProperty, m = Object.getOwnPropertyDescriptor, c = (e, t, i, a) => {
  for (var r = a > 1 ? void 0 : a ? m(t, i) : t, s = e.length - 1, l; s >= 0; s--)
    (l = e[s]) && (r = (a ? l(t, i, r) : l(r)) || r);
  return a && r && C(t, i, r), r;
};
let n = class extends _ {
  constructor() {
    super(), this.value = void 0, this._availableCriteria = [], this._translators = {}, this._getAvailableCriteria();
  }
  async _getAvailableCriteria() {
    const t = await (await fetch("/App_Plugins/PersonalisationGroups/Criteria")).json();
    this._availableCriteria = t, this._loadTranslators();
  }
  _loadTranslators() {
    for (var e = 0; e < this._availableCriteria.length; e++) {
      const t = this._availableCriteria[e], i = "/App_Plugins/" + t.clientAssetsFolder + "/" + this._convertToPascalCase(t.alias) + "/definition.translator.js";
      import(i).then((a) => {
        this._translators[t.alias] = a, this.requestUpdate();
      }).catch(() => {
        console.log("Could not load translator for " + t.alias + " at " + i);
      });
    }
  }
  _convertToPascalCase(e) {
    return e.charAt(0).toUpperCase() + e.substr(1);
  }
  _getCriteriaName(e) {
    var t = this._getCriteriaByAlias(e);
    return t ? t.name : "";
  }
  _getCriteriaByAlias(e) {
    if (this._availableCriteria === void 0)
      return null;
    for (var t = 0; t < this._availableCriteria.length; t++)
      if (this._availableCriteria[t].alias === e)
        return this._availableCriteria[t];
    return null;
  }
  _getDefinitionTranslation(e) {
    var t = this._translators[e.alias];
    return t ? t.translate(e.definition) : "";
  }
  _addCriteria() {
    var a;
    const t = { alias: ((a = this.shadowRoot) == null ? void 0 : a.getElementById("availableCriteriaSelect")).value, definition: {} }, i = Object.assign([], this.value.details);
    i.push(t), this.value = { match: this.value.match, duration: this.value.duration, score: this.value.score, details: i }, this._editCriteria(t);
  }
  _editCriteria(e) {
    console.log(e);
  }
  _removeCriteria(e) {
    const t = Object.assign([], this.value.details);
    t.splice(e, 1), this.value = { match: this.value.match, duration: this.value.duration, score: this.value.score, details: t };
  }
  render() {
    var e, t, i, a, r, s, l, u;
    return d`<div>

                <div>
                    <label>Match:</label>
                    <select>
                        <option value="All" ?selected=${((e = this.value) == null ? void 0 : e.match) === "All"}>All</option>
                        <option value="Any" ?selected=${((t = this.value) == null ? void 0 : t.match) === "Any"}>Any</option>
                    </select>
                </div>

                <div>
                    <label>Duration:</label>
                    <select>
                        <option value="Page" ?selected=${((i = this.value) == null ? void 0 : i.duration) === "Page"}>Per page request</option>
                        <option value="Session" ?selected=${((a = this.value) == null ? void 0 : a.duration) === "Session"}>Per session</option>
                        <option value="Visitor" ?selected=${((r = this.value) == null ? void 0 : r.duration) === "Visitor"}>Per visitor</option>
                    </select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${((s = this.value) == null ? void 0 : s.score) ?? 50}" />
                    <div class="help-inline">
                        <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                    </div>
                </div>

                <div>
                    <label>Add Criteria:</label>
                    <div class="controls controls-row">
                        <select id="availableCriteriaSelect">
                            ${(l = this._availableCriteria) == null ? void 0 : l.map(
      (o) => d`<option value="${o.alias}">${o.name}</li>`
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
                        ${(u = this.value) == null ? void 0 : u.details.map(
      (o, h) => d`<tr>
                                <td>${this._getCriteriaName(o.alias)}</td>
                                <td>${this._getDefinitionTranslation(o)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(o)}>Edit</button>
                                    <button type="button" @click=${() => this._removeCriteria(h)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
c([
  p({ type: Object })
], n.prototype, "value", 2);
c([
  v()
], n.prototype, "_availableCriteria", 2);
c([
  v()
], n.prototype, "_translators", 2);
n = c([
  b("property-editor-ui-group-definition")
], n);
const g = n;
export {
  n as PropertyEditorGroupDefinitionElement,
  g as default
};
//# sourceMappingURL=personalisation-groups.js.map
