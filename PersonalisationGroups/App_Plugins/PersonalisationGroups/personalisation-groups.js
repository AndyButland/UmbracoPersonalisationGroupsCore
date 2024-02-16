import { UmbModalToken, UmbModalRouteRegistrationController, UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { property, state, customElement, LitElement, html } from "@umbraco-cms/backoffice/external/lit";
import { FormControlMixin } from "@umbraco-cms/backoffice/external/uui";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
const modals$1 = [
  {
    type: "propertyEditorUi",
    alias: "PersonalisationGroups.PropertyEditorUi.GroupDefinition",
    name: "Personalisation Groups Property Editor",
    js: () => Promise.resolve().then(() => propertyEditorUiPersonalisationGroupDefinition_element),
    elementName: "umb-property-editor-ui-personalisation-group-definition",
    meta: {
      label: "Personalisation Group Definition",
      icon: "umb:operator",
      group: "common",
      propertyEditorSchemaAlias: "personalisationGroupDefinition"
    }
  }
], manifests$2 = [...modals$1], PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS = "Umb.Modal.Forms.EditField", PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL = new UmbModalToken(
  PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS,
  {
    modal: {
      type: "sidebar",
      size: "small"
    }
  }
), modals = [
  {
    type: "modal",
    alias: PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS,
    name: "Personalisation Groups Edit Definition Modal",
    js: () => Promise.resolve().then(() => personalisationGroupDefinitionEditorModal_element)
  }
], manifests$1 = [...modals];
var __defProp$2 = Object.defineProperty, __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor, __decorateClass$2 = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? __getOwnPropDesc$2(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && __defProp$2(t, i, o), o;
};
let UmbPropertyEditorPersonalisationGroupDefinitionElement = class extends LitElement {
  constructor() {
    super(...arguments), this.value = void 0;
  }
  set config(e) {
    this._overlaySize = e == null ? void 0 : e.getValueByAlias("overlaySize");
  }
  _onChange(e) {
    this.value = e.target.definition, this.dispatchEvent(new CustomEvent("property-value-change"));
  }
  render() {
    return html`<umb-input-personalisation-group-definition
			@change="${this._onChange}"
			.overlaySize="${this._overlaySize}"
			.definition="${this.value ?? {}}"></umb-input-personalisation-group-definition>`;
  }
};
__decorateClass$2([
  property({ type: Object })
], UmbPropertyEditorPersonalisationGroupDefinitionElement.prototype, "value", 2);
__decorateClass$2([
  property({ attribute: !1 })
], UmbPropertyEditorPersonalisationGroupDefinitionElement.prototype, "config", 1);
__decorateClass$2([
  state()
], UmbPropertyEditorPersonalisationGroupDefinitionElement.prototype, "_overlaySize", 2);
UmbPropertyEditorPersonalisationGroupDefinitionElement = __decorateClass$2([
  customElement("umb-property-editor-ui-personalisation-group-definition")
], UmbPropertyEditorPersonalisationGroupDefinitionElement);
const UmbPropertyEditorPersonalisationGroupDefinitionElement$1 = UmbPropertyEditorPersonalisationGroupDefinitionElement, propertyEditorUiPersonalisationGroupDefinition_element = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get UmbPropertyEditorPersonalisationGroupDefinitionElement() {
    return UmbPropertyEditorPersonalisationGroupDefinitionElement;
  },
  default: UmbPropertyEditorPersonalisationGroupDefinitionElement$1
}, Symbol.toStringTag, { value: "Module" }));
class DayOfWeekTranslator {
  constructor() {
    this.alias = "dayOfWeek";
  }
  translate(definition) {
    var translation = "";
    if (console.log(definition), definition) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], selectedDays = eval(definition);
      for (let e = 0; e < selectedDays.length; e++)
        translation.length > 0 && (translation += ", "), translation += days[selectedDays[e] - 1];
    }
    return translation;
  }
}
class TranslatorRegistry {
  constructor() {
    this._translators = [], this._register(new DayOfWeekTranslator());
  }
  _register(t) {
    this._translators.push(t);
  }
  getByAlias(t) {
    const i = this._translators.filter((n) => n.alias == t);
    return i.length > 0 ? i[0] : null;
  }
}
var __defProp$1 = Object.defineProperty, __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor, __decorateClass$1 = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? __getOwnPropDesc$1(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && __defProp$1(t, i, o), o;
};
let UmbInputPersonalisationGroupDefinitionElement = class extends FormControlMixin(UmbElementMixin(LitElement)) {
  constructor() {
    super(), this._definition = { match: "All", duration: "Page", score: 50, details: [] }, this._availableCriteria = [], this._getAvailableCriteria(), this._translatorRegistry = new TranslatorRegistry(), this._myModalRegistration = new UmbModalRouteRegistrationController(this, PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL).addAdditionalPath(":index").onSetup((e) => {
      if (!e.index)
        return !1;
      let i = parseInt(e.index);
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
          definition: n.definition
        }
      };
    }).onSubmit((e) => {
      e && console.log(e);
    });
  }
  // Necessary to add these as the first parameter of the UmbModalRouteRegistrationController constructor expects them.
  getFormElement() {
  }
  set definition(e) {
    this._definition = {
      match: e.match,
      duration: e.duration,
      score: e.score,
      details: [...e.details]
    };
  }
  get definition() {
    return this._definition;
  }
  async _getAvailableCriteria() {
    const t = await (await fetch("/App_Plugins/PersonalisationGroups/Criteria")).json();
    this._availableCriteria = t;
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
    console.log(e);
    var t = this._translatorRegistry.getByAlias(e.alias);
    return t == null ? void 0 : t.translate(e.definition);
  }
  _addCriteria() {
    var i;
    const t = { alias: ((i = this.shadowRoot) == null ? void 0 : i.getElementById("availableCriteriaSelect")).value, definition: {} };
    this.definition.details.push(t), this.requestUpdate(), this._editCriteria(this.definition.details.length - 1);
  }
  _editCriteria(e) {
    this._myModalRegistration.open({ index: e });
  }
  _removeCriteria(e) {
    this.definition.details.splice(e, 1), this.requestUpdate();
  }
  render() {
    var e;
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
                            ${(e = this._availableCriteria) == null ? void 0 : e.map(
      (t) => html`<option value="${t.alias}">${t.name}</li>`
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
      (t, i) => html`<tr>
                                <td>${this._getCriteriaName(t.alias)}</td>
                                <td>${this._getDefinitionTranslation(t)}</td>
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
__decorateClass$1([
  property()
], UmbInputPersonalisationGroupDefinitionElement.prototype, "overlaySize", 2);
__decorateClass$1([
  property({ attribute: !1 })
], UmbInputPersonalisationGroupDefinitionElement.prototype, "definition", 1);
__decorateClass$1([
  state()
], UmbInputPersonalisationGroupDefinitionElement.prototype, "_availableCriteria", 2);
UmbInputPersonalisationGroupDefinitionElement = __decorateClass$1([
  customElement("umb-input-personalisation-group-definition")
], UmbInputPersonalisationGroupDefinitionElement);
var __defProp = Object.defineProperty, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __decorateClass = (e, t, i, n) => {
  for (var o = n > 1 ? void 0 : n ? __getOwnPropDesc(t, i) : t, r = e.length - 1, a; r >= 0; r--)
    (a = e[r]) && (o = (n ? a(t, i, o) : a(o)) || o);
  return n && o && __defProp(t, i, o), o;
};
let UmbPersonalisationGroupDefinitionEditorModalElement = class extends UmbModalBaseElement {
  constructor() {
    super(), this._index = null, this._definition = "", console.log("from modal constructor");
  }
  _submit() {
  }
  _close() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  connectedCallback() {
    super.connectedCallback(), console.log("from modal connectedCallback");
  }
  render() {
    return html`
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
__decorateClass([
  state()
], UmbPersonalisationGroupDefinitionEditorModalElement.prototype, "_index", 2);
__decorateClass([
  state()
], UmbPersonalisationGroupDefinitionEditorModalElement.prototype, "_definition", 2);
UmbPersonalisationGroupDefinitionEditorModalElement = __decorateClass([
  customElement("umb-personalisation-group-definition-editor-modal")
], UmbPersonalisationGroupDefinitionEditorModalElement);
const UmbPersonalisationGroupDefinitionEditorModalElement$1 = UmbPersonalisationGroupDefinitionEditorModalElement, personalisationGroupDefinitionEditorModal_element = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get UmbPersonalisationGroupDefinitionEditorModalElement() {
    return UmbPersonalisationGroupDefinitionEditorModalElement;
  },
  default: UmbPersonalisationGroupDefinitionEditorModalElement$1
}, Symbol.toStringTag, { value: "Module" })), manifests = [
  ...manifests$2,
  ...manifests$1
], onInit = (e, t) => {
  t.registerMany(manifests);
};
export {
  UmbInputPersonalisationGroupDefinitionElement,
  UmbPersonalisationGroupDefinitionEditorModalElement,
  UmbPropertyEditorPersonalisationGroupDefinitionElement,
  onInit
};
//# sourceMappingURL=personalisation-groups.js.map
