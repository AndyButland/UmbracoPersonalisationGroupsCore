import { UMB_AUTH_CONTEXT as ee } from "@umbraco-cms/backoffice/auth";
import { property as j, customElement as N, html as b, state as q, when as te } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as I } from "@umbraco-cms/backoffice/lit-element";
import { tryExecute as ie } from "@umbraco-cms/backoffice/resources";
class D extends Error {
  constructor(e, i, n) {
    super(n), this.name = "ApiError", this.url = i.url, this.status = i.status, this.statusText = i.statusText, this.body = i.body, this.request = e;
  }
}
class re extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class ne {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((i, n) => {
      this._resolve = i, this._reject = n;
      const r = (o) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isResolved = !0, this._resolve && this._resolve(o));
      }, s = (o) => {
        this._isResolved || this._isRejected || this._isCancelled || (this._isRejected = !0, this._reject && this._reject(o));
      }, a = (o) => {
        this._isResolved || this._isRejected || this._isCancelled || this.cancelHandlers.push(o);
      };
      return Object.defineProperty(a, "isResolved", {
        get: () => this._isResolved
      }), Object.defineProperty(a, "isRejected", {
        get: () => this._isRejected
      }), Object.defineProperty(a, "isCancelled", {
        get: () => this._isCancelled
      }), e(r, s, a);
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
      this.cancelHandlers.length = 0, this._reject && this._reject(new re("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class O {
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
    request: new O(),
    response: new O()
  }
}, y = (t) => typeof t == "string", E = (t) => y(t) && t !== "", w = (t) => t instanceof Blob, U = (t) => t instanceof FormData, se = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, ae = (t) => {
  const e = [], i = (r, s) => {
    e.push(`${encodeURIComponent(r)}=${encodeURIComponent(String(s))}`);
  }, n = (r, s) => {
    s != null && (s instanceof Date ? i(r, s.toISOString()) : Array.isArray(s) ? s.forEach((a) => n(r, a)) : typeof s == "object" ? Object.entries(s).forEach(([a, o]) => n(`${r}[${a}]`, o)) : i(r, s));
  };
  return Object.entries(t).forEach(([r, s]) => n(r, s)), e.length ? `?${e.join("&")}` : "";
}, oe = (t, e) => {
  const i = encodeURI, n = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (s, a) => {
    var o;
    return (o = e.path) != null && o.hasOwnProperty(a) ? i(String(e.path[a])) : s;
  }), r = t.BASE + n;
  return e.query ? r + ae(e.query) : r;
}, le = (t) => {
  if (t.formData) {
    const e = new FormData(), i = (n, r) => {
      y(r) || w(r) ? e.append(n, r) : e.append(n, JSON.stringify(r));
    };
    return Object.entries(t.formData).filter(([, n]) => n != null).forEach(([n, r]) => {
      Array.isArray(r) ? r.forEach((s) => i(n, s)) : i(n, r);
    }), e;
  }
}, g = async (t, e) => typeof e == "function" ? e(t) : e, ce = async (t, e) => {
  const [i, n, r, s] = await Promise.all([
    g(e, t.TOKEN),
    g(e, t.USERNAME),
    g(e, t.PASSWORD),
    g(e, t.HEADERS)
  ]), a = Object.entries({
    Accept: "application/json",
    ...s,
    ...e.headers
  }).filter(([, o]) => o != null).reduce((o, [p, h]) => ({
    ...o,
    [p]: String(h)
  }), {});
  if (E(i) && (a.Authorization = `Bearer ${i}`), E(n) && E(r)) {
    const o = se(`${n}:${r}`);
    a.Authorization = `Basic ${o}`;
  }
  return e.body !== void 0 && (e.mediaType ? a["Content-Type"] = e.mediaType : w(e.body) ? a["Content-Type"] = e.body.type || "application/octet-stream" : y(e.body) ? a["Content-Type"] = "text/plain" : U(e.body) || (a["Content-Type"] = "application/json")), new Headers(a);
}, de = (t) => {
  var e, i;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (i = t.mediaType) != null && i.includes("+json") ? JSON.stringify(t.body) : y(t.body) || w(t.body) || U(t.body) ? t.body : JSON.stringify(t.body);
}, ue = async (t, e, i, n, r, s, a) => {
  const o = new AbortController();
  let p = {
    headers: s,
    body: n ?? r,
    method: e.method,
    signal: o.signal
  };
  t.WITH_CREDENTIALS && (p.credentials = t.CREDENTIALS);
  for (const h of t.interceptors.request._fns)
    p = await h(p);
  return a(() => o.abort()), await fetch(i, p);
}, he = (t, e) => {
  if (e) {
    const i = t.headers.get(e);
    if (y(i))
      return i;
  }
}, pe = async (t) => {
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
}, fe = (t, e) => {
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
    throw new D(t, e, n);
  if (!e.ok) {
    const r = e.status ?? "unknown", s = e.statusText ?? "unknown", a = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new D(
      t,
      e,
      `Generic Error: status: ${r}; status text: ${s}; body: ${a}`
    );
  }
}, ve = (t, e) => new ne(async (i, n, r) => {
  try {
    const s = oe(t, e), a = le(e), o = de(e), p = await ce(t, e);
    if (!r.isCancelled) {
      let h = await ue(t, e, s, o, a, p, r);
      for (const Z of t.interceptors.response._fns)
        h = await Z(h);
      const X = await pe(h), Y = he(h, e.responseHeader), T = {
        url: s,
        ok: h.ok,
        status: h.status,
        statusText: h.statusText,
        body: Y ?? X
      };
      fe(e, T), i(T.body);
    }
  } catch (s) {
    n(s);
  }
});
class _e {
  /**
   * @returns unknown OK
   * @throws ApiError
   */
  static getCollection() {
    return ve(f, {
      method: "GET",
      url: "/umbraco/personalisation-groups/management/api/v1/criteria",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
}
const ye = {
  type: "propertyEditorUi",
  alias: "PersonalisationGroups.PropertyEditorUi.GroupDefinition",
  name: "Personalisation Group Definition Editor",
  js: () => Promise.resolve().then(() => Ae),
  meta: {
    label: "Personalisation Group Definition Editor",
    propertyEditorSchemaAlias: "PersonalisationGroups.GroupDefinition",
    icon: "icon-operator",
    group: "personalisation"
  }
}, me = [
  ye
];
var ge = Object.defineProperty, be = Object.getOwnPropertyDescriptor, x = (t) => {
  throw TypeError(t);
}, H = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? be(e, i) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (r = (n ? a(e, i, r) : a(r)) || r);
  return n && r && ge(e, i, r), r;
}, Ce = (t, e, i) => e.has(t) || x("Cannot " + i), Ee = (t, e, i) => e.has(t) ? x("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), Se = (t, e, i) => (Ce(t, e, "access private method"), i), S, G;
const we = "personalisation-group-definition-property-editor";
let v = class extends I {
  constructor() {
    super(...arguments), Ee(this, S), this.value = void 0;
  }
  render() {
    return b`<personalisation-group-definition-input
    @change="${Se(this, S, G)}"
    .value="${this.value ?? {}}"></personalisation-group-definition-input>`;
  }
};
S = /* @__PURE__ */ new WeakSet();
G = function(t) {
  this.value = t.target.value, this.dispatchEvent(new CustomEvent("property-value-change"));
};
H([
  j({ type: Object })
], v.prototype, "value", 2);
v = H([
  N(we)
], v);
const Re = v, Ae = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get PersonalisationGroupDefinitionPropertyUiElement() {
    return v;
  },
  default: Re
}, Symbol.toStringTag, { value: "Module" }));
var Pe = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, B = (t) => {
  throw TypeError(t);
}, C = (t, e, i, n) => {
  for (var r = n > 1 ? void 0 : n ? Te(e, i) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (r = (n ? a(e, i, r) : a(r)) || r);
  return n && r && Pe(e, i, r), r;
}, R = (t, e, i) => e.has(t) || B("Cannot " + i), u = (t, e, i) => (R(t, e, "read from private field"), i ? i.call(t) : e.get(t)), $ = (t, e, i) => e.has(t) ? B("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), De = (t, e, i, n) => (R(t, e, "write to private field"), e.set(t, i), i), c = (t, e, i) => (R(t, e, "access private method"), i), d, l, M, L, A, F, W, k, V, z, J, m, K, P, Q;
const Oe = "personalisation-group-definition-input";
let _ = class extends I {
  constructor() {
    super(...arguments), $(this, l), $(this, d, { match: "All", duration: "Page", score: 50, details: [] }), this._availableCriteria = [], this._selectedCriteria = void 0;
  }
  set value(t) {
    De(this, d, {
      match: t.match ?? "All",
      duration: t.duration ?? "Page",
      score: t.score ?? 50,
      details: t.details ? [...t.details] : []
    });
  }
  get value() {
    return u(this, d);
  }
  async connectedCallback() {
    super.connectedCallback(), await c(this, l, M).call(this);
  }
  render() {
    return b`<div>

                <div>
                    <label>Match:</label>
                    <uui-select
                        name="match"
                        @change=${c(this, l, W)}
                        .options=${c(this, l, F).call(this)}
                    ></uui-select>
                </div>

                <div>
                    <label>Duration:</label>
                    <uui-select
                        name="duration"
                        @change=${c(this, l, V)}
                        .options=${c(this, l, k).call(this)}
                    ></uui-select>
                    <div class="help-inline">
                        <span>Determines for how long a user that is matched to a personalisation group remains in it</span>
                    </div>
                </div>

                <div>
                    <label>Score:</label>
                    <input type="number" min="0" max="100" step="1" value="${u(this, d).score ?? 50}" />
                    <div class="help-inline">
                        <span>A number between 1 and 100, can be used to weight groups when scoring the visitor's match to a piece of content</span>
                    </div>
                </div>

                <div>
                    <label>Add Criteria:</label>
                    <div class="controls controls-row">
                        <uui-select
                            name="criteria"
                            @change=${c(this, l, J)}
                            .options=${c(this, l, z).call(this)}
                        ></uui-select>
                        <button type="button" @click=${c(this, l, K)}>Add</button>
                        ${te(
      this._selectedCriteria,
      () => b`
                                <div class="help-inline">
                                    <span>${this._selectedCriteria.description}</span>
                                </div>`
    )}

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
                        ${u(this, d).details.map(
      (t, e) => b`<tr>
                                <td>${c(this, l, L).call(this, t.alias)}</td>
                                <td>[translation]</td>
                                <td>
                                    <button type="button" @click=${() => c(this, l, P).call(this, e)}>Edit</button>
                                    <button type="button" @click=${() => c(this, l, Q).call(this, e)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
d = /* @__PURE__ */ new WeakMap();
l = /* @__PURE__ */ new WeakSet();
M = async function() {
  const { data: t } = await ie(_e.getCollection());
  this._availableCriteria = t || [], this._selectedCriteria = this._availableCriteria.length > 0 ? this._availableCriteria[0] : void 0;
};
L = function(t) {
  var e = c(this, l, A).call(this, t);
  return e ? e.name : "";
};
A = function(t) {
  if (this._availableCriteria !== void 0)
    return this._availableCriteria.find((e) => e.alias === t);
};
F = function() {
  return [
    {
      name: "All",
      value: "All",
      selected: u(this, d).match === "All"
    },
    {
      name: "Any",
      value: "Any",
      selected: u(this, d).match === "Any"
    }
  ];
};
W = function(t) {
  u(this, d).match = t.target.value.toString(), c(this, l, m).call(this);
};
k = function() {
  return [
    {
      name: "Per page request",
      value: "Page",
      selected: u(this, d).duration === "Page"
    },
    {
      name: "Per session",
      value: "Session",
      selected: u(this, d).duration === "Session"
    },
    {
      name: "Per visitor",
      value: "Visitor",
      selected: u(this, d).duration === "Visitor"
    }
  ];
};
V = function(t) {
  u(this, d).duration = t.target.value.toString(), c(this, l, m).call(this);
};
z = function() {
  var t;
  return ((t = this._availableCriteria) == null ? void 0 : t.map((e) => {
    var i;
    return {
      name: e.name,
      value: e.alias,
      selected: e.alias === ((i = this._selectedCriteria) == null ? void 0 : i.alias)
    };
  })) ?? [];
};
J = function(t) {
  const e = t.target.value.toString();
  this._selectedCriteria = c(this, l, A).call(this, e);
};
m = function() {
  this.requestUpdate(), this.dispatchEvent(
    new CustomEvent("change", { composed: !0, bubbles: !0 })
  );
};
K = function() {
  var e;
  if (!this._selectedCriteria)
    return;
  const t = { alias: (e = this._selectedCriteria) == null ? void 0 : e.alias, definition: {} };
  u(this, d).details.push(t), c(this, l, m).call(this), c(this, l, P).call(this, u(this, d).details.length - 1);
};
P = function(t) {
  alert("edit: " + t);
};
Q = function(t) {
  u(this, d).details.splice(t, 1), c(this, l, m).call(this);
};
C([
  j({ attribute: !1 })
], _.prototype, "value", 1);
C([
  q()
], _.prototype, "_availableCriteria", 2);
C([
  q()
], _.prototype, "_selectedCriteria", 2);
_ = C([
  N(Oe)
], _);
const Ie = (t, e) => {
  e.registerMany(me), t.consumeContext(ee, async (i) => {
    if (!i) return;
    const n = i.getOpenApiConfiguration();
    f.BASE = n.base, f.TOKEN = n.token, f.WITH_CREDENTIALS = n.withCredentials, f.CREDENTIALS = n.credentials;
  });
};
export {
  _ as PersonalisationGroupDefinitionInput,
  v as PersonalisationGroupDefinitionPropertyUiElement,
  Ie as onInit
};
//# sourceMappingURL=personalisation-groups.js.map
