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
], manifests$2 = [...modals$1], PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL_ALIAS = "PersonalisationGroup.Modal.EditDefinition", PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL = new UmbModalToken(
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
var __defProp$3 = Object.defineProperty, __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor, __decorateClass$3 = (O, b, D, x) => {
  for (var U = x > 1 ? void 0 : x ? __getOwnPropDesc$3(b, D) : b, w = O.length - 1, G; w >= 0; w--)
    (G = O[w]) && (U = (x ? G(b, D, U) : G(U)) || U);
  return x && U && __defProp$3(b, D, U), U;
};
let UmbPropertyEditorPersonalisationGroupDefinitionElement = class extends LitElement {
  constructor() {
    super(...arguments), this.value = void 0;
  }
  set config(O) {
    this._overlaySize = O == null ? void 0 : O.getValueByAlias("overlaySize");
  }
  _onChange(O) {
    this.value = O.target.definition, this.dispatchEvent(new CustomEvent("property-value-change"));
  }
  render() {
    return html`<umb-input-personalisation-group-definition
			@change="${this._onChange}"
			.overlaySize="${this._overlaySize}"
			.definition="${this.value ?? {}}"></umb-input-personalisation-group-definition>`;
  }
};
__decorateClass$3([
  property({ type: Object })
], UmbPropertyEditorPersonalisationGroupDefinitionElement.prototype, "value", 2);
__decorateClass$3([
  property({ attribute: !1 })
], UmbPropertyEditorPersonalisationGroupDefinitionElement.prototype, "config", 1);
__decorateClass$3([
  state()
], UmbPropertyEditorPersonalisationGroupDefinitionElement.prototype, "_overlaySize", 2);
UmbPropertyEditorPersonalisationGroupDefinitionElement = __decorateClass$3([
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
      for (let O = 0; O < selectedDays.length; O++)
        translation.length > 0 && (translation += ", "), translation += days[selectedDays[O] - 1];
    }
    return translation;
  }
}
class TranslatorRegistry {
  constructor() {
    this._translators = [], this._register(new DayOfWeekTranslator());
  }
  _register(b) {
    this._translators.push(b);
  }
  getByAlias(b) {
    const D = this._translators.filter((x) => x.alias == b);
    return D.length > 0 ? D[0] : null;
  }
}
var __defProp$2 = Object.defineProperty, __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor, __decorateClass$2 = (O, b, D, x) => {
  for (var U = x > 1 ? void 0 : x ? __getOwnPropDesc$2(b, D) : b, w = O.length - 1, G; w >= 0; w--)
    (G = O[w]) && (U = (x ? G(b, D, U) : G(U)) || U);
  return x && U && __defProp$2(b, D, U), U;
};
let UmbInputPersonalisationGroupDefinitionElement = class extends FormControlMixin(UmbElementMixin(LitElement)) {
  constructor() {
    super(), this._definition = { match: "All", duration: "Page", score: 50, details: [] }, this._availableCriteria = [], this._getAvailableCriteria(), this._translatorRegistry = new TranslatorRegistry(), this._myModalRegistration = new UmbModalRouteRegistrationController(this, PERSONALISATION_GROUP_DEFINITION_EDITOR_MODAL).addAdditionalPath(":index").onSetup((O) => {
      if (!O.index)
        return !1;
      let D = parseInt(O.index);
      if (Number.isNaN(D))
        return !1;
      const x = this.definition.details[D];
      return {
        data: {
          index: D,
          config: {
            overlaySize: this.overlaySize || "small"
          }
        },
        value: {
          detail: x
        }
      };
    }).onSubmit((O) => {
      O && console.log(O);
    });
  }
  // Necessary to add these as the first parameter of the UmbModalRouteRegistrationController constructor expects them.
  getFormElement() {
  }
  set definition(O) {
    this._definition = {
      match: O.match,
      duration: O.duration,
      score: O.score,
      details: [...O.details]
    };
  }
  get definition() {
    return this._definition;
  }
  async _getAvailableCriteria() {
    const b = await (await fetch("/App_Plugins/PersonalisationGroups/Criteria")).json();
    this._availableCriteria = b;
  }
  _getCriteriaName(O) {
    var b = this._getCriteriaByAlias(O);
    return b ? b.name : "";
  }
  _getCriteriaByAlias(O) {
    if (this._availableCriteria === void 0)
      return null;
    for (var b = 0; b < this._availableCriteria.length; b++)
      if (this._availableCriteria[b].alias === O)
        return this._availableCriteria[b];
    return null;
  }
  _getDefinitionTranslation(O) {
    var b = this._translatorRegistry.getByAlias(O.alias);
    return b == null ? void 0 : b.translate(O.definition);
  }
  _addCriteria() {
    var D;
    const b = { alias: ((D = this.shadowRoot) == null ? void 0 : D.getElementById("availableCriteriaSelect")).value, definition: {} };
    this.definition.details.push(b), this.requestUpdate(), this._editCriteria(this.definition.details.length - 1);
  }
  _editCriteria(O) {
    this._myModalRegistration.open({ index: O });
  }
  _removeCriteria(O) {
    this.definition.details.splice(O, 1), this.requestUpdate();
  }
  render() {
    var O;
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
                            ${(O = this._availableCriteria) == null ? void 0 : O.map(
      (b) => html`<option value="${b.alias}">${b.name}</li>`
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
      (b, D) => html`<tr>
                                <td>${this._getCriteriaName(b.alias)}</td>
                                <td>${this._getDefinitionTranslation(b)}</td>
                                <td>
                                    <button type="button" @click=${() => this._editCriteria(D)}>Edit</button>
                                    <button type="button" @click=${() => this._removeCriteria(D)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
__decorateClass$2([
  property()
], UmbInputPersonalisationGroupDefinitionElement.prototype, "overlaySize", 2);
__decorateClass$2([
  property({ attribute: !1 })
], UmbInputPersonalisationGroupDefinitionElement.prototype, "definition", 1);
__decorateClass$2([
  state()
], UmbInputPersonalisationGroupDefinitionElement.prototype, "_availableCriteria", 2);
UmbInputPersonalisationGroupDefinitionElement = __decorateClass$2([
  customElement("umb-input-personalisation-group-definition")
], UmbInputPersonalisationGroupDefinitionElement);
var __defProp$1 = Object.defineProperty, __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor, __decorateClass$1 = (O, b, D, x) => {
  for (var U = x > 1 ? void 0 : x ? __getOwnPropDesc$1(b, D) : b, w = O.length - 1, G; w >= 0; w--)
    (G = O[w]) && (U = (x ? G(b, D, U) : G(U)) || U);
  return x && U && __defProp$1(b, D, U), U;
};
let UmbPersonalisationGroupDefinitionEditorModalElement = class extends UmbModalBaseElement {
  constructor() {
    super(), this._index = null, this._detail = { alias: "", definition: "" };
  }
  _submit() {
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
					<umb-personalisation-group-definition-editor-modal-detail .detail="${this._detail}" />
				</uui-box>
				<div slot="actions">
					<uui-button label="Close" @click=${this._rejectModal}></uui-button>
					<uui-button label="Submit" look="primary" color="positive" @click=${this._submit}></uui-button>
				</div>
			</umb-body-layout>
		`;
  }
};
__decorateClass$1([
  state()
], UmbPersonalisationGroupDefinitionEditorModalElement.prototype, "_index", 2);
__decorateClass$1([
  state()
], UmbPersonalisationGroupDefinitionEditorModalElement.prototype, "_detail", 2);
UmbPersonalisationGroupDefinitionEditorModalElement = __decorateClass$1([
  customElement("umb-personalisation-group-definition-editor-modal")
], UmbPersonalisationGroupDefinitionEditorModalElement);
const UmbPersonalisationGroupDefinitionEditorModalElement$1 = UmbPersonalisationGroupDefinitionEditorModalElement, personalisationGroupDefinitionEditorModal_element = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get UmbPersonalisationGroupDefinitionEditorModalElement() {
    return UmbPersonalisationGroupDefinitionEditorModalElement;
  },
  default: UmbPersonalisationGroupDefinitionEditorModalElement$1
}, Symbol.toStringTag, { value: "Module" }));
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t;
const i = window, s = i.trustedTypes, e$1 = s ? s.createPolicy("lit-html", { createHTML: (O) => O }) : void 0, o$1 = "$lit$", n = `lit$${(Math.random() + "").slice(9)}$`, l = "?" + n, h = `<${l}>`, r = document, u = () => r.createComment(""), d = (O) => O === null || typeof O != "object" && typeof O != "function", c = Array.isArray, v = (O) => c(O) || typeof (O == null ? void 0 : O[Symbol.iterator]) == "function", a = `[ 	
\f\r]`, f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y = /^(?:script|style|textarea|title)$/i, T = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), E = /* @__PURE__ */ new WeakMap(), C = r.createTreeWalker(r, 129, null, !1);
function P(O, b) {
  if (!Array.isArray(O) || !O.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return e$1 !== void 0 ? e$1.createHTML(b) : b;
}
const V = (O, b) => {
  const D = O.length - 1, x = [];
  let U, w = b === 2 ? "<svg>" : "", G = f;
  for (let J = 0; J < D; J++) {
    const j = O[J];
    let W, F, q = -1, K = 0;
    for (; K < j.length && (G.lastIndex = K, F = G.exec(j), F !== null); )
      K = G.lastIndex, G === f ? F[1] === "!--" ? G = _ : F[1] !== void 0 ? G = m : F[2] !== void 0 ? (y.test(F[2]) && (U = RegExp("</" + F[2], "g")), G = p) : F[3] !== void 0 && (G = p) : G === p ? F[0] === ">" ? (G = U ?? f, q = -1) : F[1] === void 0 ? q = -2 : (q = G.lastIndex - F[2].length, W = F[1], G = F[3] === void 0 ? p : F[3] === '"' ? $ : g) : G === $ || G === g ? G = p : G === _ || G === m ? G = f : (G = p, U = void 0);
    const Q = G === p && O[J + 1].startsWith("/>") ? " " : "";
    w += G === f ? j + h : q >= 0 ? (x.push(W), j.slice(0, q) + o$1 + j.slice(q) + n + Q) : j + n + (q === -2 ? (x.push(void 0), J) : Q);
  }
  return [P(O, w + (O[D] || "<?>") + (b === 2 ? "</svg>" : "")), x];
};
class N {
  constructor({ strings: b, _$litType$: D }, x) {
    let U;
    this.parts = [];
    let w = 0, G = 0;
    const J = b.length - 1, j = this.parts, [W, F] = V(b, D);
    if (this.el = N.createElement(W, x), C.currentNode = this.el.content, D === 2) {
      const q = this.el.content, K = q.firstChild;
      K.remove(), q.append(...K.childNodes);
    }
    for (; (U = C.nextNode()) !== null && j.length < J; ) {
      if (U.nodeType === 1) {
        if (U.hasAttributes()) {
          const q = [];
          for (const K of U.getAttributeNames())
            if (K.endsWith(o$1) || K.startsWith(n)) {
              const Q = F[G++];
              if (q.push(K), Q !== void 0) {
                const Y = U.getAttribute(Q.toLowerCase() + o$1).split(n), X = /([.?@])?(.*)/.exec(Q);
                j.push({ type: 1, index: w, name: X[2], strings: Y, ctor: X[1] === "." ? H : X[1] === "?" ? L : X[1] === "@" ? z : k });
              } else
                j.push({ type: 6, index: w });
            }
          for (const K of q)
            U.removeAttribute(K);
        }
        if (y.test(U.tagName)) {
          const q = U.textContent.split(n), K = q.length - 1;
          if (K > 0) {
            U.textContent = s ? s.emptyScript : "";
            for (let Q = 0; Q < K; Q++)
              U.append(q[Q], u()), C.nextNode(), j.push({ type: 2, index: ++w });
            U.append(q[K], u());
          }
        }
      } else if (U.nodeType === 8)
        if (U.data === l)
          j.push({ type: 2, index: w });
        else {
          let q = -1;
          for (; (q = U.data.indexOf(n, q + 1)) !== -1; )
            j.push({ type: 7, index: w }), q += n.length - 1;
        }
      w++;
    }
  }
  static createElement(b, D) {
    const x = r.createElement("template");
    return x.innerHTML = b, x;
  }
}
function S(O, b, D = O, x) {
  var U, w, G, J;
  if (b === T)
    return b;
  let j = x !== void 0 ? (U = D._$Co) === null || U === void 0 ? void 0 : U[x] : D._$Cl;
  const W = d(b) ? void 0 : b._$litDirective$;
  return (j == null ? void 0 : j.constructor) !== W && ((w = j == null ? void 0 : j._$AO) === null || w === void 0 || w.call(j, !1), W === void 0 ? j = void 0 : (j = new W(O), j._$AT(O, D, x)), x !== void 0 ? ((G = (J = D)._$Co) !== null && G !== void 0 ? G : J._$Co = [])[x] = j : D._$Cl = j), j !== void 0 && (b = S(O, j._$AS(O, b.values), j, x)), b;
}
class M {
  constructor(b, D) {
    this._$AV = [], this._$AN = void 0, this._$AD = b, this._$AM = D;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(b) {
    var D;
    const { el: { content: x }, parts: U } = this._$AD, w = ((D = b == null ? void 0 : b.creationScope) !== null && D !== void 0 ? D : r).importNode(x, !0);
    C.currentNode = w;
    let G = C.nextNode(), J = 0, j = 0, W = U[0];
    for (; W !== void 0; ) {
      if (J === W.index) {
        let F;
        W.type === 2 ? F = new R(G, G.nextSibling, this, b) : W.type === 1 ? F = new W.ctor(G, W.name, W.strings, this, b) : W.type === 6 && (F = new Z(G, this, b)), this._$AV.push(F), W = U[++j];
      }
      J !== (W == null ? void 0 : W.index) && (G = C.nextNode(), J++);
    }
    return C.currentNode = r, w;
  }
  v(b) {
    let D = 0;
    for (const x of this._$AV)
      x !== void 0 && (x.strings !== void 0 ? (x._$AI(b, x, D), D += x.strings.length - 2) : x._$AI(b[D])), D++;
  }
}
class R {
  constructor(b, D, x, U) {
    var w;
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = b, this._$AB = D, this._$AM = x, this.options = U, this._$Cp = (w = U == null ? void 0 : U.isConnected) === null || w === void 0 || w;
  }
  get _$AU() {
    var b, D;
    return (D = (b = this._$AM) === null || b === void 0 ? void 0 : b._$AU) !== null && D !== void 0 ? D : this._$Cp;
  }
  get parentNode() {
    let b = this._$AA.parentNode;
    const D = this._$AM;
    return D !== void 0 && (b == null ? void 0 : b.nodeType) === 11 && (b = D.parentNode), b;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(b, D = this) {
    b = S(this, b, D), d(b) ? b === A || b == null || b === "" ? (this._$AH !== A && this._$AR(), this._$AH = A) : b !== this._$AH && b !== T && this._(b) : b._$litType$ !== void 0 ? this.g(b) : b.nodeType !== void 0 ? this.$(b) : v(b) ? this.T(b) : this._(b);
  }
  k(b) {
    return this._$AA.parentNode.insertBefore(b, this._$AB);
  }
  $(b) {
    this._$AH !== b && (this._$AR(), this._$AH = this.k(b));
  }
  _(b) {
    this._$AH !== A && d(this._$AH) ? this._$AA.nextSibling.data = b : this.$(r.createTextNode(b)), this._$AH = b;
  }
  g(b) {
    var D;
    const { values: x, _$litType$: U } = b, w = typeof U == "number" ? this._$AC(b) : (U.el === void 0 && (U.el = N.createElement(P(U.h, U.h[0]), this.options)), U);
    if (((D = this._$AH) === null || D === void 0 ? void 0 : D._$AD) === w)
      this._$AH.v(x);
    else {
      const G = new M(w, this), J = G.u(this.options);
      G.v(x), this.$(J), this._$AH = G;
    }
  }
  _$AC(b) {
    let D = E.get(b.strings);
    return D === void 0 && E.set(b.strings, D = new N(b)), D;
  }
  T(b) {
    c(this._$AH) || (this._$AH = [], this._$AR());
    const D = this._$AH;
    let x, U = 0;
    for (const w of b)
      U === D.length ? D.push(x = new R(this.k(u()), this.k(u()), this, this.options)) : x = D[U], x._$AI(w), U++;
    U < D.length && (this._$AR(x && x._$AB.nextSibling, U), D.length = U);
  }
  _$AR(b = this._$AA.nextSibling, D) {
    var x;
    for ((x = this._$AP) === null || x === void 0 || x.call(this, !1, !0, D); b && b !== this._$AB; ) {
      const U = b.nextSibling;
      b.remove(), b = U;
    }
  }
  setConnected(b) {
    var D;
    this._$AM === void 0 && (this._$Cp = b, (D = this._$AP) === null || D === void 0 || D.call(this, b));
  }
}
class k {
  constructor(b, D, x, U, w) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = b, this.name = D, this._$AM = U, this.options = w, x.length > 2 || x[0] !== "" || x[1] !== "" ? (this._$AH = Array(x.length - 1).fill(new String()), this.strings = x) : this._$AH = A;
  }
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(b, D = this, x, U) {
    const w = this.strings;
    let G = !1;
    if (w === void 0)
      b = S(this, b, D, 0), G = !d(b) || b !== this._$AH && b !== T, G && (this._$AH = b);
    else {
      const J = b;
      let j, W;
      for (b = w[0], j = 0; j < w.length - 1; j++)
        W = S(this, J[x + j], D, j), W === T && (W = this._$AH[j]), G || (G = !d(W) || W !== this._$AH[j]), W === A ? b = A : b !== A && (b += (W ?? "") + w[j + 1]), this._$AH[j] = W;
    }
    G && !U && this.j(b);
  }
  j(b) {
    b === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, b ?? "");
  }
}
class H extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(b) {
    this.element[this.name] = b === A ? void 0 : b;
  }
}
const I = s ? s.emptyScript : "";
class L extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(b) {
    b && b !== A ? this.element.setAttribute(this.name, I) : this.element.removeAttribute(this.name);
  }
}
class z extends k {
  constructor(b, D, x, U, w) {
    super(b, D, x, U, w), this.type = 5;
  }
  _$AI(b, D = this) {
    var x;
    if ((b = (x = S(this, b, D, 0)) !== null && x !== void 0 ? x : A) === T)
      return;
    const U = this._$AH, w = b === A && U !== A || b.capture !== U.capture || b.once !== U.once || b.passive !== U.passive, G = b !== A && (U === A || w);
    w && this.element.removeEventListener(this.name, this, U), G && this.element.addEventListener(this.name, this, b), this._$AH = b;
  }
  handleEvent(b) {
    var D, x;
    typeof this._$AH == "function" ? this._$AH.call((x = (D = this.options) === null || D === void 0 ? void 0 : D.host) !== null && x !== void 0 ? x : this.element, b) : this._$AH.handleEvent(b);
  }
}
class Z {
  constructor(b, D, x) {
    this.element = b, this.type = 6, this._$AN = void 0, this._$AM = D, this.options = x;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(b) {
    S(this, b);
  }
}
const B = i.litHtmlPolyfillSupport;
B == null || B(N, R), ((t = i.litHtmlVersions) !== null && t !== void 0 ? t : i.litHtmlVersions = []).push("2.8.0");
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e = Symbol.for(""), o = (O) => ({ _$litStatic$: O, r: e });
class DayOfWeekEditor {
  constructor() {
    this.alias = "dayOfWeek", this._definition = [];
  }
  loadDefinition(definition) {
    this._definition = eval(definition);
  }
  _isSelected(O) {
    const b = this._definition.indexOf(O) > -1;
    return console.log(b), b;
  }
  render() {
    return html`<div id="definition-editor">
            <p>Please select the days for which this group will be valid:</p>

            <table>
                <tr><td>Sunday: </td><td><input type="checkbox" ${this._isSelected(1) ? "checked" : ""} /></td></tr>
                <tr><td>Monday: </td><td><input type="checkbox" ${o(this._isSelected(2) ? "checked" : "")} /></td></tr>
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
  _register(b) {
    this._editors.push(b);
  }
  getByAlias(b) {
    const D = this._editors.filter((x) => x.alias == b);
    return D.length > 0 ? D[0] : null;
  }
}
var __defProp = Object.defineProperty, __getOwnPropDesc = Object.getOwnPropertyDescriptor, __decorateClass = (O, b, D, x) => {
  for (var U = x > 1 ? void 0 : x ? __getOwnPropDesc(b, D) : b, w = O.length - 1, G; w >= 0; w--)
    (G = O[w]) && (U = (x ? G(b, D, U) : G(U)) || U);
  return x && U && __defProp(b, D, U), U;
};
let UmbPersonalisationGroupDefinitionEditorModalDetailElement = class extends LitElement {
  constructor() {
    super(), this.detail = { alias: "", definition: "" }, this._editorRegistry = new EditorRegistry();
  }
  _renderEditor() {
    var O = this._editorRegistry.getByAlias(this.detail.alias);
    if (O)
      return console.log(O), O.loadDefinition(this.detail.definition), console.log(O), O == null ? void 0 : O.render();
  }
  render() {
    return html`${this._renderEditor()}`;
  }
};
__decorateClass([
  property({ attribute: !0 })
], UmbPersonalisationGroupDefinitionEditorModalDetailElement.prototype, "detail", 2);
UmbPersonalisationGroupDefinitionEditorModalDetailElement = __decorateClass([
  customElement("umb-personalisation-group-definition-editor-modal-detail")
], UmbPersonalisationGroupDefinitionEditorModalDetailElement);
const manifests = [
  ...manifests$2,
  ...manifests$1
], onInit = (O, b) => {
  b.registerMany(manifests);
};
export {
  UmbInputPersonalisationGroupDefinitionElement,
  UmbPersonalisationGroupDefinitionEditorModalDetailElement,
  UmbPersonalisationGroupDefinitionEditorModalElement,
  UmbPropertyEditorPersonalisationGroupDefinitionElement,
  onInit
};
//# sourceMappingURL=personalisation-groups.js.map
