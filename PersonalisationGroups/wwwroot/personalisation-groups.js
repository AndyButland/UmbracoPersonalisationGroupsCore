import { UMB_AUTH_CONTEXT as re } from "@umbraco-cms/backoffice/auth";
import { property as I, customElement as q, html as f, state as x, when as ne, until as ae } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as U } from "@umbraco-cms/backoffice/lit-element";
import { tryExecute as se } from "@umbraco-cms/backoffice/resources";
import { umbExtensionsRegistry as oe } from "@umbraco-cms/backoffice/extension-registry";
import { loadManifestApi as le } from "@umbraco-cms/backoffice/extension-api";
class $ extends Error {
  constructor(e, i, r) {
    super(r), this.name = "ApiError", this.url = i.url, this.status = i.status, this.statusText = i.statusText, this.body = i.body, this.request = e;
  }
}
class ce extends Error {
  constructor(e) {
    super(e), this.name = "CancelError";
  }
  get isCancelled() {
    return !0;
  }
}
class de {
  constructor(e) {
    this._isResolved = !1, this._isRejected = !1, this._isCancelled = !1, this.cancelHandlers = [], this.promise = new Promise((i, r) => {
      this._resolve = i, this._reject = r;
      const n = (o) => {
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
      }), e(n, a, s);
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
      this.cancelHandlers.length = 0, this._reject && this._reject(new ce("Request aborted"));
    }
  }
  get isCancelled() {
    return this._isCancelled;
  }
}
class j {
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
const y = {
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
    request: new j(),
    response: new j()
  }
}, m = (t) => typeof t == "string", D = (t) => m(t) && t !== "", S = (t) => t instanceof Blob, G = (t) => t instanceof FormData, ue = (t) => {
  try {
    return btoa(t);
  } catch {
    return Buffer.from(t).toString("base64");
  }
}, he = (t) => {
  const e = [], i = (n, a) => {
    e.push(`${encodeURIComponent(n)}=${encodeURIComponent(String(a))}`);
  }, r = (n, a) => {
    a != null && (a instanceof Date ? i(n, a.toISOString()) : Array.isArray(a) ? a.forEach((s) => r(n, s)) : typeof a == "object" ? Object.entries(a).forEach(([s, o]) => r(`${n}[${s}]`, o)) : i(n, a));
  };
  return Object.entries(t).forEach(([n, a]) => r(n, a)), e.length ? `?${e.join("&")}` : "";
}, pe = (t, e) => {
  const i = encodeURI, r = e.url.replace("{api-version}", t.VERSION).replace(/{(.*?)}/g, (a, s) => {
    var o;
    return (o = e.path) != null && o.hasOwnProperty(s) ? i(String(e.path[s])) : a;
  }), n = t.BASE + r;
  return e.query ? n + he(e.query) : n;
}, fe = (t) => {
  if (t.formData) {
    const e = new FormData(), i = (r, n) => {
      m(n) || S(n) ? e.append(r, n) : e.append(r, JSON.stringify(n));
    };
    return Object.entries(t.formData).filter(([, r]) => r != null).forEach(([r, n]) => {
      Array.isArray(n) ? n.forEach((a) => i(r, a)) : i(r, n);
    }), e;
  }
}, b = async (t, e) => typeof e == "function" ? e(t) : e, ye = async (t, e) => {
  const [i, r, n, a] = await Promise.all([
    b(e, t.TOKEN),
    b(e, t.USERNAME),
    b(e, t.PASSWORD),
    b(e, t.HEADERS)
  ]), s = Object.entries({
    Accept: "application/json",
    ...a,
    ...e.headers
  }).filter(([, o]) => o != null).reduce((o, [p, h]) => ({
    ...o,
    [p]: String(h)
  }), {});
  if (D(i) && (s.Authorization = `Bearer ${i}`), D(r) && D(n)) {
    const o = ue(`${r}:${n}`);
    s.Authorization = `Basic ${o}`;
  }
  return e.body !== void 0 && (e.mediaType ? s["Content-Type"] = e.mediaType : S(e.body) ? s["Content-Type"] = e.body.type || "application/octet-stream" : m(e.body) ? s["Content-Type"] = "text/plain" : G(e.body) || (s["Content-Type"] = "application/json")), new Headers(s);
}, _e = (t) => {
  var e, i;
  if (t.body !== void 0)
    return (e = t.mediaType) != null && e.includes("application/json") || (i = t.mediaType) != null && i.includes("+json") ? JSON.stringify(t.body) : m(t.body) || S(t.body) || G(t.body) ? t.body : JSON.stringify(t.body);
}, ve = async (t, e, i, r, n, a, s) => {
  const o = new AbortController();
  let p = {
    headers: a,
    body: r ?? n,
    method: e.method,
    signal: o.signal
  };
  t.WITH_CREDENTIALS && (p.credentials = t.CREDENTIALS);
  for (const h of t.interceptors.request._fns)
    p = await h(p);
  return s(() => o.abort()), await fetch(i, p);
}, me = (t, e) => {
  if (e) {
    const i = t.headers.get(e);
    if (m(i))
      return i;
  }
}, ge = async (t) => {
  if (t.status !== 204)
    try {
      const e = t.headers.get("Content-Type");
      if (e) {
        const i = ["application/octet-stream", "application/pdf", "application/zip", "audio/", "image/", "video/"];
        if (e.includes("application/json") || e.includes("+json"))
          return await t.json();
        if (i.some((r) => e.includes(r)))
          return await t.blob();
        if (e.includes("multipart/form-data"))
          return await t.formData();
        if (e.includes("text/"))
          return await t.text();
      }
    } catch (e) {
      console.error(e);
    }
}, be = (t, e) => {
  const r = {
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
  if (r)
    throw new $(t, e, r);
  if (!e.ok) {
    const n = e.status ?? "unknown", a = e.statusText ?? "unknown", s = (() => {
      try {
        return JSON.stringify(e.body, null, 2);
      } catch {
        return;
      }
    })();
    throw new $(
      t,
      e,
      `Generic Error: status: ${n}; status text: ${a}; body: ${s}`
    );
  }
}, Ce = (t, e) => new de(async (i, r, n) => {
  try {
    const a = pe(t, e), s = fe(e), o = _e(e), p = await ye(t, e);
    if (!n.isCancelled) {
      let h = await ve(t, e, a, o, s, p, n);
      for (const ie of t.interceptors.response._fns)
        h = await ie(h);
      const ee = await ge(h), te = me(h, e.responseHeader), O = {
        url: a,
        ok: h.ok,
        status: h.status,
        statusText: h.statusText,
        body: te ?? ee
      };
      be(e, O), i(O.body);
    }
  } catch (a) {
    r(a);
  }
});
class Ee {
  /**
   * @returns unknown OK
   * @throws ApiError
   */
  static getCollection() {
    return Ce(y, {
      method: "GET",
      url: "/umbraco/personalisation-groups/management/api/v1/criteria",
      errors: {
        401: "The resource is protected and requires an authentication token"
      }
    });
  }
}
const De = {
  type: "propertyEditorUi",
  alias: "PersonalisationGroups.PropertyEditorUi.GroupDefinition",
  name: "Personalisation Group Definition Editor",
  js: () => Promise.resolve().then(() => Ie),
  meta: {
    label: "Personalisation Group Definition Editor",
    propertyEditorSchemaAlias: "PersonalisationGroups.GroupDefinition",
    icon: "icon-operator",
    group: "personalisation"
  }
}, we = [
  De
];
class Ae {
  translate(e) {
    return "TRANSLATED";
  }
  destroy() {
  }
}
const Se = [
  {
    type: "PersonalisationGroupDetailDefinitionTranslator",
    alias: "PersonalisationGroup.DefinitionDetailTranslator.DayOfWeek",
    name: "Day Of Week Translator",
    criteriaAlias: "dayOfWeek",
    api: Ae
  }
];
var Re = Object.defineProperty, Te = Object.getOwnPropertyDescriptor, H = (t) => {
  throw TypeError(t);
}, M = (t, e, i, r) => {
  for (var n = r > 1 ? void 0 : r ? Te(e, i) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (n = (r ? s(e, i, n) : s(n)) || n);
  return r && n && Re(e, i, n), n;
}, Pe = (t, e, i) => e.has(t) || H("Cannot " + i), Oe = (t, e, i) => e.has(t) ? H("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), $e = (t, e, i) => (Pe(t, e, "access private method"), i), A, B;
const je = "personalisation-group-definition-property-editor";
let _ = class extends U {
  constructor() {
    super(...arguments), Oe(this, A), this.value = void 0;
  }
  render() {
    return f`<personalisation-group-definition-input
    @change="${$e(this, A, B)}"
    .value="${this.value ?? {}}"></personalisation-group-definition-input>`;
  }
};
A = /* @__PURE__ */ new WeakSet();
B = function(t) {
  this.value = t.target.value, this.dispatchEvent(new CustomEvent("property-value-change"));
};
M([
  I({ type: Object })
], _.prototype, "value", 2);
_ = M([
  q(je)
], _);
const Ne = _, Ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get PersonalisationGroupDefinitionPropertyUiElement() {
    return _;
  },
  default: Ne
}, Symbol.toStringTag, { value: "Module" }));
var qe = Object.defineProperty, xe = Object.getOwnPropertyDescriptor, L = (t) => {
  throw TypeError(t);
}, E = (t, e, i, r) => {
  for (var n = r > 1 ? void 0 : r ? xe(e, i) : e, a = t.length - 1, s; a >= 0; a--)
    (s = t[a]) && (n = (r ? s(e, i, n) : s(n)) || n);
  return r && n && qe(e, i, n), n;
}, R = (t, e, i) => e.has(t) || L("Cannot " + i), u = (t, e, i) => (R(t, e, "read from private field"), i ? i.call(t) : e.get(t)), w = (t, e, i) => e.has(t) ? L("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, i), N = (t, e, i, r) => (R(t, e, "write to private field"), e.set(t, i), i), c = (t, e, i) => (R(t, e, "access private method"), i), d, C, l, W, k, T, F, V, z, J, K, Q, g, X, P, Y, Z;
const Ue = "personalisation-group-definition-input";
let v = class extends U {
  constructor() {
    super(), w(this, l), w(this, d, { match: "All", duration: "Page", score: 50, details: [] }), this._availableCriteria = [], this._selectedCriteria = void 0, w(this, C, []), N(this, C, oe.getAllExtensions().filter((t) => t.type === "PersonalisationGroupDetailDefinitionTranslator").map((t) => t));
  }
  set value(t) {
    N(this, d, {
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
    super.connectedCallback(), await c(this, l, W).call(this);
  }
  render() {
    return f`<div>

                <div>
                    <label>Match:</label>
                    <uui-select
                        name="match"
                        @change=${c(this, l, V)}
                        .options=${c(this, l, F).call(this)}
                    ></uui-select>
                </div>

                <div>
                    <label>Duration:</label>
                    <uui-select
                        name="duration"
                        @change=${c(this, l, J)}
                        .options=${c(this, l, z).call(this)}
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
                            @change=${c(this, l, Q)}
                            .options=${c(this, l, K).call(this)}
                        ></uui-select>
                        <button type="button" @click=${c(this, l, X)}>Add</button>
                        ${ne(
      this._selectedCriteria,
      () => f`
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
      (t, e) => f`<tr>
                                <td>${c(this, l, k).call(this, t.alias)}</td>
                                <td>
                                    ${ae(
        c(this, l, Z).call(this, t).then((i) => f`${i}`),
        f``
      )}
                                </td>
                                <td>
                                    <button type="button" @click=${() => c(this, l, P).call(this, e)}>Edit</button>
                                    <button type="button" @click=${() => c(this, l, Y).call(this, e)}>Delete</button>
                                </td>
                            </tr>`
    )}
                    </tbody>
                </table>

            </div>`;
  }
};
d = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakMap();
l = /* @__PURE__ */ new WeakSet();
W = async function() {
  const { data: t } = await se(Ee.getCollection());
  this._availableCriteria = t || [], this._selectedCriteria = this._availableCriteria.length > 0 ? this._availableCriteria[0] : void 0;
};
k = function(t) {
  var e = c(this, l, T).call(this, t);
  return e ? e.name : "";
};
T = function(t) {
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
V = function(t) {
  u(this, d).match = t.target.value.toString(), c(this, l, g).call(this);
};
z = function() {
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
J = function(t) {
  u(this, d).duration = t.target.value.toString(), c(this, l, g).call(this);
};
K = function() {
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
Q = function(t) {
  const e = t.target.value.toString();
  this._selectedCriteria = c(this, l, T).call(this, e);
};
g = function() {
  this.requestUpdate(), this.dispatchEvent(
    new CustomEvent("change", { composed: !0, bubbles: !0 })
  );
};
X = function() {
  var e;
  if (!this._selectedCriteria)
    return;
  const t = { alias: (e = this._selectedCriteria) == null ? void 0 : e.alias, definition: {} };
  u(this, d).details.push(t), c(this, l, g).call(this), c(this, l, P).call(this, u(this, d).details.length - 1);
};
P = function(t) {
  console.log("edit: " + t);
};
Y = function(t) {
  u(this, d).details.splice(t, 1), c(this, l, g).call(this);
};
Z = async function(t) {
  const e = u(this, C).find((r) => r.criteriaAlias === t.alias);
  if (!e)
    return "";
  const i = await le(e.api);
  if (i) {
    const r = new i();
    if (r)
      return r.translate(t.definition);
  }
  return "";
};
E([
  I({ attribute: !1 })
], v.prototype, "value", 1);
E([
  x()
], v.prototype, "_availableCriteria", 2);
E([
  x()
], v.prototype, "_selectedCriteria", 2);
v = E([
  q(Ue)
], v);
const Ge = [
  ...we,
  ...Se
], Fe = (t, e) => {
  e.registerMany(Ge), t.consumeContext(re, async (i) => {
    if (!i) return;
    const r = i.getOpenApiConfiguration();
    y.BASE = r.base, y.TOKEN = r.token, y.WITH_CREDENTIALS = r.withCredentials, y.CREDENTIALS = r.credentials;
  });
};
export {
  Ae as DayOfWeekDefinitionDetailTranslator,
  v as PersonalisationGroupDefinitionInput,
  _ as PersonalisationGroupDefinitionPropertyUiElement,
  Fe as onInit
};
//# sourceMappingURL=personalisation-groups.js.map
