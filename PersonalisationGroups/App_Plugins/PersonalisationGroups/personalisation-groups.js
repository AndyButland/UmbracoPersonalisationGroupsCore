import { UmbModalToken, UmbModalRouteRegistrationController, UmbModalBaseElement } from "@umbraco-cms/backoffice/modal";
import { property, state, customElement, LitElement, html, unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
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
var __defProp$2 = Object.defineProperty, __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor, __decorateClass$2 = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? __getOwnPropDesc$2(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (o = (n ? a(e, i, o) : a(o)) || o);
  return n && o && __defProp$2(e, i, o), o;
};
let UmbPropertyEditorPersonalisationGroupDefinitionElement = class extends LitElement {
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
    if (definition) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], selectedDays = eval(definition);
      for (let t = 0; t < selectedDays.length; t++)
        translation.length > 0 && (translation += ", "), translation += days[selectedDays[t] - 1];
    }
    return translation;
  }
}
class TranslatorRegistry {
  constructor() {
    this._translators = [], this._register(new DayOfWeekTranslator());
  }
  _register(e) {
    this._translators.push(e);
  }
  getByAlias(e) {
    const i = this._translators.filter((n) => n.alias == e);
    return i.length > 0 ? i[0] : null;
  }
}
var __defProp$1 = Object.defineProperty, __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor, __decorateClass$1 = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? __getOwnPropDesc$1(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (o = (n ? a(e, i, o) : a(o)) || o);
  return n && o && __defProp$1(e, i, o), o;
};
let UmbInputPersonalisationGroupDefinitionElement = class extends FormControlMixin(UmbElementMixin(LitElement)) {
  constructor() {
    super(), this._definition = { match: "All", duration: "Page", score: 50, details: [] }, this._availableCriteria = [], this._getAvailableCriteria(), this._translatorRegistry = new TranslatorRegistry(), this._myModalRegistration = new UmbModalRouteRegistrationController(this, PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL).addAdditionalPath(":index").onSetup((t) => {
      if (!t.index)
        return !1;
      let i = parseInt(t.index);
      if (Number.isNaN(i))
        return !1;
      const n = this.definition.details[i];
      return {
        data: {
          index: i,
          config: {
            overlaySize: this.overlaySize || "small"
          }
        },
        value: {
          detail: n
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
    this._availableCriteria = e;
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
    var e = this._translatorRegistry.getByAlias(t.alias);
    return e == null ? void 0 : e.translate(t.definition);
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
                            ${(t = this._availableCriteria) == null ? void 0 : t.map(
      (e) => html`<option value="${e.alias}">${e.name}</li>`
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
      (e, i) => html`<tr>
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
class DayOfWeekEditor {
  constructor() {
    this.alias = "dayOfWeek", this._definition = [];
  }
  loadDefinition(definition) {
    this._definition = eval(definition);
  }
  readDefinition(t) {
    var e = t.querySelectorAll("input[type=checkbox]");
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      console.log(n);
    }
    return JSON.stringify(this._definition);
  }
  _isSelected(t) {
    return this._definition.indexOf(t) > -1;
  }
  _test(t) {
    console.log(t.target.value);
  }
  render() {
    return `<div id="definition-editor">
            <p>Please select the days for which this group will be valid:</p>

            <p><input type="text" value="" @change=${this._test} />

            <table>
                <tr><td>Sunday: </td><td><input type="checkbox" ${this._isSelected(1) ? "checked" : ""}/></td></tr>
                <tr><td>Monday: </td><td><input type="checkbox" ${this._isSelected(2) ? "checked" : ""} /></td></tr>
                <tr><td>Tuesday: </td><td><input type="checkbox" ${this._isSelected(3) ? "checked" : ""} /></td></tr>
                <tr><td>Wednesday: </td><td><input type="checkbox" ${this._isSelected(4) ? "checked" : ""} /></td></tr>
                <tr><td>Thursday: </td><td><input type="checkbox" ${this._isSelected(5) ? "checked" : ""} /></td></tr>
                <tr><td>Friday: </td><td><input type="checkbox" ${this._isSelected(6) ? "checked" : ""} /></td></tr>
                <tr><td>Saturday: </td><td><input type="checkbox" ${this._isSelected(7) ? "checked" : ""} /></td></tr>
            </table>
        </div>`;
  }
}
class EditorRegistry {
  constructor() {
    this._editors = [], this._register(new DayOfWeekEditor());
  }
  _register(e) {
    this._editors.push(e);
  }
  getByAlias(e) {
    const i = this._editors.filter((n) => n.alias == e);
    return i.length > 0 ? i[0] : null;
  }
}
var __defProp = Object.defineProperty, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __decorateClass = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? __getOwnPropDesc(e, i) : e, r = t.length - 1, a; r >= 0; r--)
    (a = t[r]) && (o = (n ? a(e, i, o) : a(o)) || o);
  return n && o && __defProp(e, i, o), o;
};
let UmbPersonalisationGroupDefinitionEditorModalElement = class extends UmbModalBaseElement {
  constructor() {
    super(), this._index = null, this._detail = { alias: "", definition: "" }, this._editorRegistry = new EditorRegistry();
  }
  _renderEditor() {
    var t = this._editorRegistry.getByAlias(this._detail.alias);
    return t ? (t.loadDefinition(this._detail.definition), t == null ? void 0 : t.render()) : "";
  }
  _submit() {
    var i;
    var t = this._editorRegistry.getByAlias(this._detail.alias);
    if (t) {
      this.connectedCallback();
      var e = (i = this.shadowRoot) == null ? void 0 : i.getElementById("definition-editor");
      e && console.log(e.innerHTML);
    }
    this._submitModal();
  }
  connectedCallback() {
    super.connectedCallback(), this.value && (this._detail = {
      alias: this.value.detail.alias,
      definition: this.value.detail.definition
    });
  }
  render() {
    return html`
			<umb-body-layout headline="Edit Definition">
				<uui-box>
					${unsafeHTML(this._renderEditor())}
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._rejectModal}></uui-button>
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
], UmbPersonalisationGroupDefinitionEditorModalElement.prototype, "_detail", 2);
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
], onInit = (t, e) => {
  e.registerMany(manifests);
};
export {
  UmbInputPersonalisationGroupDefinitionElement,
  UmbPersonalisationGroupDefinitionEditorModalElement,
  UmbPropertyEditorPersonalisationGroupDefinitionElement,
  onInit
};
//# sourceMappingURL=personalisation-groups.js.map
