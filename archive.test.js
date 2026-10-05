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

test('ada elemen notice-box 503 status', async () => {
  const { d } = await load();
  const box = d.querySelector('.notice-box');
  assert.ok(box, 'notice-box harus ada');
  assert.equal(d.querySelector('.notice-tag').textContent.trim(), '— status —');
  assert.equal(d.querySelector('.notice-code').textContent.trim(), '503');
  assert.ok(d.querySelector('.notice-title').textContent.length > 0);
  assert.ok(d.querySelector('.notice-body').textContent.length > 0);
});

test('tidak ada iframe/audio/video/embed', async () => {
  const { d } = await load();
  assert.equal(d.querySelectorAll('iframe,audio,video,embed,object').length, 0);
});
