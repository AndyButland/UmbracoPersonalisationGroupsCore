import { property as m, state as p, customElement as f, LitElement as b, html as u } from "@umbraco-cms/backoffice/external/lit";
import { FormControlMixin as _ } from "@umbraco-cms/backoffice/external/uui";
import { UmbModalToken as y, UmbModalRouteRegistrationController as g, UmbModalBaseElement as P } from "@umbraco-cms/backoffice/modal";
import { UmbElementMixin as C } from "@umbraco-cms/backoffice/element-api";
const D = [
  {
    type: "propertyEditorUi",
    alias: "PersonalisationGroups.PropertyEditorUi.GroupDefinition",
    name: "Personalisation Groups Property Editor",
    js: () => Promise.resolve().then(() => M),
    elementName: "umb-property-editor-ui-personalisation-group-definition",
    meta: {
      label: "Personalisation Group Definition",
      icon: "umb:operator",
      group: "common",
      propertyEditorSchemaAlias: "personalisationGroupDefinition"
    }
  }
], E = [...D], $ = [
  {
    type: "modal",
    alias: "PersonalisationGroups.Modal.DetailDefinition",
    name: "Personalisation Groups Edit Definition Modal",
    js: () => Promise.resolve().then(() => I)
  }
], A = [...$];
var O = Object.defineProperty, S = Object.getOwnPropertyDescriptor, h = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? S(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (o = (n ? a(e, i, o) : a(o)) || o);
  return n && o && O(e, i, o), o;
};
let s = class extends b {
  constructor() {
    super(...arguments), this.value = void 0;
  }
  set config(t) {
    this._overlaySize = t == null ? void 0 : t.getValueByAlias("overlaySize");
  }
  _onChange(t) {
    this.value = t.target.definition, this.dispatchEvent(new CustomEvent("property-value-change"));
  }
  render() {
    return u`<umb-input-personalisation-group-definition
			@change="${this._onChange}"
			.overlaySize="${this._overlaySize}"
			.definition="${this.value ?? {}}"></umb-input-personalisation-group-definition>`;
  }
};
h([
  m({ type: Object })
], s.prototype, "value", 2);
h([
  m({ attribute: !1 })
], s.prototype, "config", 1);
h([
  p()
], s.prototype, "_overlaySize", 2);
s = h([
  f("umb-property-editor-ui-personalisation-group-definition")
], s);
const G = s, M = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get UmbPropertyEditorPersonalisationGroupDefinitionElement() {
    return s;
  },
  default: G
}, Symbol.toStringTag, { value: "Module" })), U = new y(
  "PersonalisationGroups.Modal.DetailDefinition",
  {
    modal: {
      type: "sidebar",
      size: "small"
    }
  }
);
var w = Object.defineProperty, j = Object.getOwnPropertyDescriptor, c = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? j(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (o = (n ? a(e, i, o) : a(o)) || o);
  return n && o && w(e, i, o), o;
};
let l = class extends _(C(b)) {
  constructor() {
    super(), this._definition = { match: "All", duration: "Page", score: 50, details: [] }, this._availableCriteria = [], this._translators = {}, this._getAvailableCriteria(), this._myModalRegistration = new g(this, U).addAdditionalPath(":index").onSetup((t) => {
      if (!t.index)
        return !1;
      let i = parseInt(t.index);
      if (Number.isNaN(i))
        return !1;
      const n = this.definition.details[i];
      return console.log(n), {
        data: {
          index: i,
          config: {
            overlaySize: this.overlaySize || "small"
          }
        },
        value: {
          definition: {
            alias: n.definition.alias,
            match: n.definition.match,
            value: n.definition.value
          }
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
    const e = await (await fetch("/App_Plugins/PersonalisationGroups/Criteria")).json();
    this._availableCriteria = e, this._loadTranslators();
  }
  _loadTranslators() {
    for (var t = 0; t < this._availableCriteria.length; t++) {
      const e = this._availableCriteria[t], i = "/App_Plugins/" + e.clientAssetsFolder + "/" + this._convertToPascalCase(e.alias) + "/definition.translator.js";
      import(i).then((n) => {
        this._translators[e.alias] = n, this.requestUpdate();
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
    this.definition.details.push(e), this.requestUpdate(), this._editCriteria(this.definition.details.length - 1);
  }
  _editCriteria(t) {
    this._myModalRegistration.open({ index: t });
  }
  _removeCriteria(t) {
    this.definition.details.splice(t, 1), this.requestUpdate();
  }
  render() {
    var t;
    return u`<div>

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
      (e) => u`<option value="${e.alias}">${e.name}</li>`
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
      (e, i) => u`<tr>
                                <td>${this._getCriteriaName(e.alias)}</td>
                                <td>${this._getDefinitionTranslation(e)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(i)}>Edit</button>
                                    <button type="button" @click=${() => this._removeCriteria(i)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
c([
  m()
], l.prototype, "overlaySize", 2);
c([
  m({ attribute: !1 })
], l.prototype, "definition", 1);
c([
  p()
], l.prototype, "_availableCriteria", 2);
c([
  p()
], l.prototype, "_translators", 2);
l = c([
  f("umb-input-personalisation-group-definition")
], l);
var x = Object.defineProperty, T = Object.getOwnPropertyDescriptor, v = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? T(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (o = (n ? a(e, i, o) : a(o)) || o);
  return n && o && x(e, i, o), o;
};
let d = class extends P {
  constructor() {
    super(), this._index = null, this._definition = {
      alias: "",
      match: "",
      value: ""
    }, console.log("from modal constructor");
  }
  _submit() {
  }
  _close() {
    var t;
    (t = this.modalContext) == null || t.reject();
  }
  connectedCallback() {
    super.connectedCallback(), console.log("from modal connectedCallback");
  }
  render() {
    return u`
			<umb-body-layout headline="Edit Definition">
				<uui-box>
					<p>[EDIT]</p>
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._close}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this._submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
  }
};
v([
  p()
], d.prototype, "_index", 2);
v([
  p()
], d.prototype, "_definition", 2);
d = v([
  f("umb-personalisation-group-definition-editor-modal")
], d);
const z = d, I = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get UmbPersonalisationGroupDefinitionEditorModalElement() {
    return d;
  },
  default: z
}, Symbol.toStringTag, { value: "Module" })), N = [
  ...E,
  ...A
], L = (t, e) => {
  e.registerMany(N);
};
export {
  l as UmbInputPersonalisationGroupDefinitionElement,
  d as UmbPersonalisationGroupDefinitionEditorModalElement,
  s as UmbPropertyEditorPersonalisationGroupDefinitionElement,
  L as onInit
};
//# sourceMappingURL=personalisation-groups.js.map
