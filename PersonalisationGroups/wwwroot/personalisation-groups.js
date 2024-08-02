import { UMB_AUTH_CONTEXT as X } from "@umbraco-cms/backoffice/auth";
import { property as $, customElement as j, html as m, state as Y } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as N } from "@umbraco-cms/backoffice/lit-element";
import { tryExecute as Z } from "@umbraco-cms/backoffice/resources";
class T extends Error {
  constructor(e, i, n) {
    super(n), this.name = "ApiError", this.url = i.url, this.status = i.status, this.statusText = i.statusText, this.body = i.body, this.request = e;
  }
}
class ee extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class te {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((i, n) => {
      this._resolve = i, this._reject = n;
      const r = (o) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(o));
      }, a = (o) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isRejected = !0, this._reject && this._reject(o));
      }, s = (o) => {
        this._isResolved || this._isRejected || this._isCancelled || this.cancelHandlers.push(o);
      };
      return Object.defineProperty(s, "isResolved", {
        get: () => this._isResolved
      }), Object.defineProperty(s, "isRejected", {
        get: () => this._isRejected
      }), Object.defineProperty(s, "isCancelled", {
        get: () => this._isCancelled
      }), e(r, a, s);
    });
  }
  get [Symbol.toStringTag]() {
    return "Cancellable Promise";
  }
  then(e, i) {
    return this.promise.then(e, i);
  }
  catch(e) {
    return this.promise.catch(e);
  }
  finally(e) {
    return this.promise.finally(e);
  }
  cancel() {
    if (!(this._isResolved || this._isRejected || this._isCancelled)) {
      if (this._isCancelled = !0, this.cancelHandlers.length)
        try {
          for (const e of this.cancelHandlers)
            e();
        } catch (e) {
          console.warn("Cancellation threw an error", e);
          return;
        }
      this.cancelHandlers.length = 0, this._reject && this._reject(new ee("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class D {
  constructor() {
    this._fns = [];
  }
  eject(e) {
    const i = this._fns.indexOf(e);
    i !== -1 && (this._fns = [...this._fns.slice(0, i), ...this._fns.slice(i + 1)]);
  }
  use(e) {
    this._fns = [...this._fns, e];
  }
}
const f = {
  BASE: "",
  CREDENTIALS: "include",
  ENCODE_PATH: void 0,
  HEADERS: void 0,
  PASSWORD: void 0,
  TOKEN: void 0,
  USERNAME: void 0,
  VERSION: "Latest",
  WITH_CREDENTIALS: !1,
  interceptors: {
    request: new D(),
    response: new D()
  }
}, y = (t) => typeof t == "string", g = (t) => y(t) && t !== "", E = (t) => t instanceof Blob, I = (t) => t instanceof FormData, ie = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, re = (t) => {
  const e = [], i = (r, a) => {
    e.push(`${encodeURIComponent(r)}=${encodeURIComponent(String(a))}`);
  }, n = (r, a) => {
    a != null && (a instanceof Date ? i(r, a.toISOString()) : Array.isArray(a) ? a.forEach((s) => n(r, s)) : typeof a == "object" ? Object.entries(a).forEach(([s, o]) => n(`${r}[${s}]`, o)) : i(r, a));
  };
  return Object.entries(t).forEach(([r, a]) => n(r, a)), e.length ? `?${e.join("&")}` : "";
}, ne = (t, e) => {
  const i = encodeURI, n = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (a, s) => {
    var o;
    return (o = e.path) != null && o.hasOwnProperty(s) ? i(String(e.path[s])) : a;
  }), r = t.BASE + n;
  return e.query ? r + re(e.query) : r;
}, ae = (t) => {
  if (t.formData) {
    const e = new FormData(), i = (n, r) => {
      y(r) || E(r) ? e.append(n, r) : e.append(n, JSON.stringify(r));
    };
    return Object.entries(t.formData).filter(([, n]) => n != null).forEach(([n, r]) => {
      Array.isArray(r) ? r.forEach((a) => i(n, a)) : i(n, r);
    }), e;
  }
}, _ = async (t, e) => typeof e == "function" ? e(t) : e, se = async (t, e) => {
  const [i, n, r, a] = await Promise.all([
    _(e, t.TOKEN),
    _(e, t.USERNAME),
    _(e, t.PASSWORD),
    _(e, t.HEADERS)
  ]), s = Object.entries({
    Accept: "application/json",
    ...a,
    ...e.headers
  }).filter(([, o]) => o != null).reduce((o, [p, h]) => ({
    ...o,
    [p]: String(h)
  }), {});
  if (g(i) && (s.Authorization = `Bearer ${i}`), g(n) && g(r)) {
    const o = ie(`${n}:${r}`);
    s.Authorization = `Basic ${o}`;
  }
  return e.body !== void 0 && (e.mediaType ? s["Content-Type"] = e.mediaType : E(e.body) ? s["Content-Type"] = e.body.type || "application/octet-stream" : y(e.body) ? s["Content-Type"] = "text/plain" : I(e.body) || (s["Content-Type"] = "application/json")), new Headers(s);
}, oe = (t) => {
  var e, i;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (i = t.mediaType) != null && i.includes("+json") ? JSON.stringify(t.body) : y(t.body) || E(t.body) || I(t.body) ? t.body : JSON.stringify(t.body);
}, le = async (t, e, i, n, r, a, s) => {
  const o = new AbortController();
  let p = {
    headers: a,
    body: n ?? r,
    method: e.method,
    signal: o.signal
  };
  t.WITH_CREDENTIALS && (p.credentials = t.CREDENTIALS);
  for (const h of t.interceptors.request._fns)
    p = await h(p);
  return s(() => o.abort()), await fetch(i, p);
}, ce = (t, e) => {
  if (e) {
    const i = t.headers.get(e);
    if (y(i))
      return i;
  }
}, de = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e) {
        const i = ["application/octet-stream", "application/pdf", "application/zip", "audio/", "image/", "video/"];
        if (e.includes("application/json") || e.includes("+json"))
          return await t.json();
        if (i.some((n) => e.includes(n)))
          return await t.blob();
        if (e.includes("multipart/form-data"))
          return await t.formData();
        if (e.includes("text/"))
          return await t.text();
      }
    } catch (e) {
      console.error(e);
    }
}, ue = (t, e) => {
  const n = {
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "URI Too Long",
    415: "Unsupported Media Type",
    416: "Range Not Satisfiable",
    417: "Expectation Failed",
    418: "Im a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Content",
    423: "Locked",
    424: "Failed Dependency",
    425: "Too Early",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    451: "Unavailable For Legal Reasons",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    ...t.errors
  }[e.status];
  if (n)
    throw new T(t, e, n);
  if (!e.ok) {
    const r = e.status ?? "unknown", a = e.statusText ?? "unknown", s = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new T(
      t,
      e,
      `Generic Error: status: ${r}; status text: ${a}; body: ${s}`
    );
  }
}, he = (t, e) => new te(async (i, n, r) => {
  try {
    const a = ne(t, e), s = ae(e), o = oe(e), p = await se(t, e);
    if (!r.isCancelled) {
      let h = await le(t, e, a, o, s, p, r);
      for (const Q of t.interceptors.response._fns)
        h = await Q(h);
      const J = await de(h), K = ce(h, e.responseHeader), P = {
        url: a,
        ok: h.ok,
        status: h.status,
        statusText: h.statusText,
        body: K ?? J
      };
      ue(e, P), i(P.body);
    }
  } catch (a) {
    n(a);
  }
});
class pe {
  /**
   * @returns unknown OK
   * @throws ApiError
   */
  static getCollection() {
    return he(f, {
      method: "GET",
      url: "/umbraco/personalisation-groups/management/api/v1/criteria",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
}
const fe = {
  type: "propertyEditorUi",
  alias: "PersonalisationGroups.PropertyEditorUi.GroupDefinition",
  name: "Personalisation Group Definition Editor",
  js: () => Promise.resolve().then(() => Se),
  meta: {
    label: "Personalisation Group Definition Editor",
    propertyEditorSchemaAlias: "PersonalisationGroups.GroupDefinition",
    icon: "icon-operator",
    group: "personalisation"
  }
}, ve = [
  fe
];
var ye = Object.defineProperty, _e = Object.getOwnPropertyDescriptor, q = (t) => {
  throw TypeError(t);
}, U = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? _e(e, i) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && ye(e, i, r), r;
}, me = (t, e, i) => e.has(t) || q("Cannot " + i), be = (t, e, i) => e.has(t) ? q("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), ge = (t, e, i) => (me(t, e, "access private method"), i), C, x;
const Ce = "personalisation-group-definition-property-editor";
let v = class extends N {
  constructor() {
    super(...arguments), be(this, C), this.value = void 0;
  }
  render() {
    return m`<personalisation-group-definition-input
    @change="${ge(this, C, x)}"
    .value="${this.value ?? {}}"></personalisation-group-definition-input>`;
  }
};
C = /* @__PURE__ */ new WeakSet();
x = function(t) {
  this.value = t.target.value, this.dispatchEvent(new CustomEvent("property-value-change"));
};
U([
  $({ type: Object })
], v.prototype, "value", 2);
v = U([
  j(Ce)
], v);
const Ee = v, Se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get PersonalisationGroupDefinitionPropertyUiElement() {
    return v;
  },
  default: Ee
}, Symbol.toStringTag, { value: "Module" }));
var we = Object.defineProperty, Re = Object.getOwnPropertyDescriptor, H = (t) => {
  throw TypeError(t);
}, S = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Re(e, i) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (r = (n ? s(e, i, r) : s(r)) || r);
  return n && r && we(e, i, r), r;
}, w = (t, e, i) => e.has(t) || H("Cannot " + i), u = (t, e, i) => (w(t, e, "read from private field"), i ? i.call(t) : e.get(t)), O = (t, e, i) => e.has(t) ? H("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), Ae = (t, e, i, n) => (w(t, e, "write to private field"), e.set(t, i), i), d = (t, e, i) => (w(t, e, "access private method"), i), l, c, G, B, M, L, F, W, k, R, V, A, z;
const Pe = "personalisation-group-definition-input";
let b = class extends N {
  constructor() {
    super(...arguments), O(this, c), O(this, l, { match: "All", duration: "Page", score: 50, details: [] }), this._availableCriteria = [];
  }
  set value(t) {
    Ae(this, l, {
      match: t.match ?? "All",
      duration: t.duration ?? "Page",
      score: t.score ?? 50,
      details: t.details ? [...t.details] : []
    });
  }
  get value() {
    return u(this, l);
  }
  async connectedCallback() {
    super.connectedCallback(), await d(this, c, G).call(this);
  }
  render() {
    var t;
    return m`<div>

                <div>
                    <label>Match:</label>
                    <uui-select
                        name="match"
                        @change=${d(this, c, F)}
                        .options=${d(this, c, L).call(this)}
                    ></uui-select>
                </div>

                <div>
                    <label>Duration:</label>
                    <uui-select
                        name="duration"
                        @change=${d(this, c, k)}
                        .options=${d(this, c, W).call(this)}
                    ></uui-select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${u(this, l).score ?? 50}" />
                    <div class="help-inline">
                        <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                    </div>
                </div>

                <div>
                    <label>Add Criteria:</label>
                    <div class="controls controls-row">
                        <select id="availableCriteriaSelect">
                            ${(t = this._availableCriteria) == null ? void 0 : t.map(
      (e) => m`<option value="${e.alias}">${e.name}</li>`
    )}
                        </select>
                        <button type="button" @click=${d(this, c, V)}>Add</button>
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
                        ${u(this, l).details.map(
      (e, i) => m`<tr>
                                <td>${d(this, c, B).call(this, e.alias)}</td>
                                <td>[translation]</td>
                                <td>
                                    <button type="button" @click=${() => d(this, c, A).call(this, i)}>Edit</button>
                                    <button type="button" @click=${() => d(this, c, z).call(this, i)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
l = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
G = async function() {
  const { data: t } = await Z(pe.getCollection());
  console.log(t), this._availableCriteria = t || [];
};
B = function(t) {
  var e = d(this, c, M).call(this, t);
  return e ? e.name : "";
};
M = function(t) {
  if (this._availableCriteria === void 0)
    return null;
  for (var e = 0; e < this._availableCriteria.length; e++)
    if (this._availableCriteria[e].alias === t)
      return this._availableCriteria[e];
  return null;
};
L = function() {
  return [
    {
      name: "All",
      value: "All",
      selected: u(this, l).match === "All"
    },
    {
      name: "Any",
      value: "Any",
      selected: u(this, l).match === "Any"
    }
  ];
};
F = function(t) {
  u(this, l).match = t.target.value.toString(), d(this, c, R).call(this);
};
W = function() {
  return [
    {
      name: "Per page request",
      value: "Page",
      selected: u(this, l).duration === "Page"
    },
    {
      name: "Per session",
      value: "Session",
      selected: u(this, l).duration === "Session"
    },
    {
      name: "Per visitor",
      value: "Visitor",
      selected: u(this, l).duration === "Visitor"
    }
  ];
};
k = function(t) {
  u(this, l).duration = t.target.value.toString(), d(this, c, R).call(this);
};
R = function() {
  this.requestUpdate(), this.dispatchEvent(
    new CustomEvent("change", { composed: !0, bubbles: !0 })
  );
};
V = function() {
  var i;
  const e = { alias: ((i = this.shadowRoot) == null ? void 0 : i.getElementById("availableCriteriaSelect")).value, definition: {} };
  u(this, l).details.push(e), d(this, c, A).call(this, u(this, l).details.length - 1);
};
A = function(t) {
  alert("edit: " + t);
};
z = function(t) {
  u(this, l).details.splice(t, 1);
};
S([
  $({ attribute: !1 })
], b.prototype, "value", 1);
S([
  Y()
], b.prototype, "_availableCriteria", 2);
b = S([
  j(Pe)
], b);
const je = (t, e) => {
  e.registerMany(ve), t.consumeContext(X, async (i) => {
    if (!i) return;
    const n = i.getOpenApiConfiguration();
    f.BASE = n.base, f.TOKEN = n.token, f.WITH_CREDENTIALS = n.withCredentials, f.CREDENTIALS = n.credentials;
  });
};
export {
  b as PersonalisationGroupDefinitionInput,
  v as PersonalisationGroupDefinitionPropertyUiElement,
  je as onInit
};
//# sourceMappingURL=personalisation-groups.js.map
