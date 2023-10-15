import { property as l, state as u, customElement as v, LitElement as y, html as h } from "@umbraco-cms/backoffice/external/lit";
var m = Object.defineProperty, f = Object.getOwnPropertyDescriptor, n = (e, o, a, r) => {
  for (var t = r > 1 ? void 0 : r ? f(o, a) : o, s = e.length - 1, p; s >= 0; s--)
    (p = e[s]) && (t = (r ? p(o, a, t) : p(t)) || t);
  return r && t && m(o, a, t), t;
};
let i = class extends y {
  constructor() {
    super(), this.value = void 0;
  }
  set config(e) {
    this._overlaySize = e == null ? void 0 : e.getValueByAlias("overlaySize");
  }
  _onChange(e) {
    this.value = e.target.definition, this.dispatchEvent(new CustomEvent("property-value-change"));
  }
  render() {
    return h`<umb-input-personalisation-group-definition
			@change="${this._onChange}"
			.overlaySize="${this._overlaySize}"
			.definition="${this.value ?? {}}"></umb-input-personalisation-group-definition>`;
  }
};
n([
  l({ type: Object })
], i.prototype, "value", 2);
n([
  l({ attribute: !1 })
], i.prototype, "config", 1);
n([
  u()
], i.prototype, "_overlaySize", 2);
i = n([
  v("umb-property-editor-ui-personalisation-group-definition")
], i);
const _ = i;
export {
  i as UmbPropertyEditorPersonalisationGroupDefinitionElement,
  _ as default
};
//# sourceMappingURL=personalisation-groups.js.map
