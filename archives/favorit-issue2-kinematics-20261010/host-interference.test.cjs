// Local reproduction: execute the existing gallery harness and actual host
// diagnostic listeners; measure observable layout reads and storage writes.
// No browser timing or iPhone jank claim is made by this VM test.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const host = fs.readFileSync(__dirname + '/index.html', 'utf8');
const parity = fs.readFileSync(__dirname + '/parity.test.cjs', 'utf8');
const runtimeSource = parity.slice(parity.indexOf('function runtime('), parity.indexOf("test('cancel completes"));
const runtime = new Function('require', '__dirname', 'fs', 'vm', 'M', runtimeSource + '\nreturn runtime;')(
  require, __dirname, fs, vm, require('./favorit-model.js'));
function section(start, end) {
  const a = host.indexOf(start), b = host.indexOf(end, a);
  assert.ok(a >= 0 && b > a, 'host section boundaries exist');
  return host.slice(a, b);
}
function exercise(search) {
  const r = runtime(), c = r.context;
  const listeners = [], counts = {layout: 0, styles: 0, storage: 0};
  let now = 200;
  c.performance.now = () => now;
  c.document.addEventListener = (type, fn, capture) => listeners.push({type, fn, capture});
  c.document.documentElement = {};
  Object.defineProperty(c.document.documentElement, 'scrollHeight', {get() {counts.layout++; return 1000;}});
  c.document.body = {};
  c.document.querySelector = () => ({});
  c.getComputedStyle = () => {counts.styles++; return {};};
  c.localStorage = {setItem() {counts.storage++;}};
  c.location = {search};
  c.URLSearchParams = URLSearchParams;
  c.folderScrollLock = null;
  c.describe = node => node === r.box ? '#files' : 'document';
  c.runtimeLog = [];
  c.runtimeState = {events: 0, delivery: {}};
  c.window.innerHeight = 678;
  c.Event = class {
    constructor(type) {
      this.type = type; this.target = {closest(selector) {return selector.includes('#files') ? r.box : null;}};
      this.currentTarget = r.box;
      this.touches = [{clientX: 100, clientY: 350}, {clientX: 300, clientY: 350}];
    }
    preventDefault() {this.defaultPrevented = true;}
  };
  const gate = section('const runtimeQuery=', '\nif(runtimeDiagnosticsView)');
  const persistence = section('  let diagnosticRelayTimer=', '  window.__archiveRecordDiagnostic=record;');
  const observers = section('  const styles=node=>', '  const nativeAlert=');
  vm.runInContext(gate + '\nif(runtimeDiagnose && !runtimeDiagnosticsView){\n' + persistence + observers + '\n}', c);
  r.c.begin(new c.Event('touchstart'));
  Object.keys(counts).forEach(k => counts[k] = 0);
  c.runtimeLog.length = 0;
  for (const time of [200, 216, 232]) {
    now = time;
    const event = new c.Event('touchmove');
    for (const l of listeners.filter(l => l.type === event.type && l.capture === true)) l.fn(event);
    r.c.move(event); // Actual active Gallery.move calls the patched preventDefault.
    for (const l of listeners.filter(l => l.type === event.type && l.capture === false)) l.fn(event);
    assert.equal(event.defaultPrevented, true);
  }
  return {counts, kinds: c.runtimeLog.map(e => e.kind)};
}
test('diagnose=1 adds synchronous layout/style reads and storage writes to two-finger movement', () => {
  const off = exercise(''), on = exercise('?diagnose=1');
  assert.deepEqual(off.counts, {layout: 0, styles: 0, storage: 0});
  assert.deepEqual(on.kinds, ['touchmove', 'preventDefault', 'touchmove:bubble']);
  assert.deepEqual(on.counts, {layout: 3, styles: 12, storage: 3});
  console.log('same three two-finger moves:', {off: off.counts, on: on.counts});
});
