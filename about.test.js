const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const FILE = path.resolve(process.env.PAGE || path.join(__dirname, 'about.html'));
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
const about = (d) => d.querySelector('article');

test('halaman about berdiri sendiri tanpa nav, subt, atau eq header', async () => {
  const { d } = await load();
  assert.equal(d.querySelector('nav'), null, 'nav tidak boleh ada');
  assert.equal(d.querySelector('.subt'), null, 'subt tidak boleh ada');
  assert.equal(d.querySelector('.eq'), null, 'eq tidak boleh ada');
});

test('judul tab memuat About Me', async () => {
  const { d } = await load();
  await tick();
  assert.ok(about(d), 'article about harus ada');
  assert.match(d.title, /About Me/);
});

test('Fullwidth.convert: ASCII -> fullwidth, spasi -> U+3000', async () => {
  const { w } = await load();
  assert.ok(w.Fullwidth, 'window.Fullwidth harus ada');
  assert.equal(w.Fullwidth.convert('About Me, 1!'), 'Ａｂｏｕｔ\u3000Ｍｅ，\u3000１！'.replace('，\u3000', '，\u3000'));
});

test('judul About Me tampil fullwidth pada header utama h1', async () => {
  const { d } = await load();
  const h1 = d.querySelector('h1');
  assert.ok(h1, 'h1 harus ada');
  assert.equal(h1.textContent.trim(), '⌈ ＡＢＯＵＴ　ＭＥ ⌋');
});

test('minimal 8 bait, tiap bait tepat 2 baris', async () => {
  const { d } = await load();
  const st = [...about(d).querySelectorAll('.stz')];
  assert.ok(st.length >= 8, 'bait: ' + st.length);
  st.forEach((s, i) => assert.equal(s.querySelectorAll('[data-fw]').length, 2, 'bait ke-' + (i + 1)));
});

test('semua baris fullwidth: aria-hidden = convert(asli), .sr = teks asli tak kosong', async () => {
  const { d, w } = await load();
  const lines = [...about(d).querySelectorAll('[data-fw]')];
  assert.ok(lines.length >= 16);
  lines.forEach((el) => {
    const orig = el.querySelector('.sr').textContent;
    assert.ok(orig.trim().length > 0);
    assert.equal(el.querySelector('[aria-hidden="true"]').textContent, w.Fullwidth.convert(orig));
  });
});

test('ada pemisah ◆ dan tautan Contact', async () => {
  const { d } = await load();
  assert.equal(about(d).querySelector('.dia').textContent.trim(), '◆');
  assert.ok(about(d).querySelector('a[href="mailto:raihanhmubarak@gmail.com"]'));
});

test('tanpa embed/musik otomatis/gambar remote di halaman about', async () => {
  const { d } = await load();
  const a = about(d);
  assert.equal(a.querySelectorAll('iframe,audio,video,embed,object').length, 0);
  a.querySelectorAll('img').forEach((i) => assert.doesNotMatch(i.getAttribute('src') || '', /^(https?:)?\/\//));
});
