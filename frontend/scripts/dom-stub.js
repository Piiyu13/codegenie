/**
 * Minimal browser-global stubs so src modules can be rendered on Node.
 * (Used only by `npm run test:render`.)
 */
const store = new Map();

const localStorage = {
  getItem: (key) => (store.has(key) ? store.get(key) : null),
  setItem: (key, value) => store.set(key, String(value)),
  removeItem: (key) => store.delete(key),
  clear: () => store.clear(),
  key: (index) => [...store.keys()][index] ?? null,
  get length() {
    return store.size;
  },
};

const noop = () => {};

const element = () => ({
  style: {},
  classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  appendChild: noop,
  removeChild: noop,
  remove: noop,
  click: noop,
  focus: noop,
  select: noop,
  setAttribute: noop,
  addEventListener: noop,
  removeEventListener: noop,
});

globalThis.localStorage = localStorage;

globalThis.window = {
  localStorage,
  document: null,
  location: { href: 'http://localhost/', pathname: '/' },
  matchMedia: () => ({ matches: false, addEventListener: noop, removeEventListener: noop, addListener: noop, removeListener: noop }),
  scrollY: 0,
  scrollTo: noop,
  addEventListener: noop,
  removeEventListener: noop,
  isSecureContext: false,
  SpeechRecognition: undefined,
  webkitSpeechRecognition: undefined,
  URL: { createObjectURL: () => '', revokeObjectURL: noop },
};

globalThis.document = {
  documentElement: { classList: { add: noop, remove: noop, toggle: noop }, style: {}, setAttribute: noop },
  body: { style: {}, appendChild: noop, removeChild: noop },
  head: { appendChild: noop, removeChild: noop },
  getElementById: () => element(),
  createElement: element,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: noop,
  removeEventListener: noop,
  execCommand: () => false,
};

globalThis.window.document = globalThis.document;

try {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value: { clipboard: null, userAgent: 'node', language: 'en-US' },
  });
} catch {
  /* navigator already exists and is not configurable — fine */
}
globalThis.FileReader = class {
  readAsDataURL() {
    this.result = 'data:image/png;base64,';
    this.onload?.();
  }
};

globalThis.self = globalThis;
