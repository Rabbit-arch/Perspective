const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const FILE = path.resolve(process.env.PAGE || path.join(__dirname, 'archive.html'));
const wins = [];
after(() => wins.forEach((w) => w.close()));

async function load() {
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', pretendToBeVisual: true,
    virtualConsole: new VirtualConsole(), url: 'file://' + FILE,
  });
  wins.push(dom.window);
  return { w: dom.window, d: dom.window.document };
}
const tick = () => new Promise((r) => setTimeout(r, 30));

test('halaman archive berdiri sendiri tanpa nav, subt, atau eq header', async () => {
  const { d } = await load();
  assert.equal(d.querySelector('nav'), null, 'nav tidak boleh ada');
  assert.equal(d.querySelector('.subt'), null, 'subt tidak boleh ada');
  assert.equal(d.querySelector('.eq'), null, 'eq tidak boleh ada');
});

test('judul tab memuat Archive', async () => {
  const { d } = await load();
  assert.match(d.title, /Archive/);
});

test('ada minimal 4 elemen <details>', async () => {
  const { d } = await load();
  const details = d.querySelectorAll('details');
  assert.ok(details.length >= 4);
});

test('setiap <details> punya <summary>', async () => {
  const { d } = await load();
  const details = d.querySelectorAll('details');
  details.forEach(det => {
    const summary = det.querySelector('summary');
    assert.ok(summary, 'harus punya summary');
    assert.ok(summary.textContent.trim().length > 0, 'summary tidak boleh kosong');
  });
});

test('ada satu catatan tersembunyi .old', async () => {
  const { d } = await load();
  const old = d.querySelectorAll('details.old');
  assert.ok(old.length >= 1);
});

test('catatan .old memiliki class old', async () => {
  const { d } = await load();
  const old = d.querySelector('details.old');
  assert.ok(old.classList.contains('old'));
});

test('tidak ada iframe/audio/video/embed', async () => {
  const { d } = await load();
  assert.equal(d.querySelectorAll('iframe,audio,video,embed,object').length, 0);
});
