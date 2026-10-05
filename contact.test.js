// TDD: fungsi Contact -> membuka draft email ke raihanhmubarak@gmail.com
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const FILE = path.resolve(process.env.PAGE || path.join(__dirname, 'perspective.html'));
const MAIL = 'raihanhmubarak@gmail.com';
const wins = [];
after(() => wins.forEach((w) => w.close())); // hentikan setInterval/rAF milik halaman

async function load(hash = '') {
  const vc = new VirtualConsole(); // senyapkan "not implemented" bawaan jsdom
  const dom = await JSDOM.fromFile(FILE, {
    runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    url: 'file://' + FILE + hash,
  });
  const w = dom.window;
  wins.push(w);
  const calls = [];
  if (w.Contact) w.Contact.open = (u) => calls.push(u);
  return { w, calls, d: w.document };
}
const tick = () => new Promise((r) => setTimeout(r, 50));

test('Contact API ada dan menunjuk ke email yang benar', async () => {
  const { w } = await load();
  assert.ok(w.Contact, 'window.Contact harus ada');
  assert.equal(w.Contact.EMAIL, MAIL);
});

test('buildMailto: format mailto valid + subject/body ter-encode', async () => {
  const { w } = await load();
  const u = w.Contact.buildMailto(MAIL, 'Halo & salam', 'Baris1\nBaris2');
  assert.equal(u, 'mailto:' + MAIL + '?subject=Halo%20%26%20salam&body=Baris1%0ABaris2');
});

test('klik Contact di navigasi membuka draft email sekali', async () => {
  const { d, calls } = await load();
  d.querySelector('nav a[href="#/contact"]').click();
  await tick();
  assert.equal(calls.length, 1);
  assert.ok(calls[0].startsWith('mailto:' + MAIL));
});

test('klik contact di footer juga membuka draft email', async () => {
  const { d, calls } = await load();
  d.querySelector('footer a[href="#/contact"]').click();
  await tick();
  assert.equal(calls.length, 1);
  assert.ok(calls[0].startsWith('mailto:' + MAIL));
});

test('link navigasi lain TIDAK memicu email', async () => {
  const { d, calls } = await load();
  d.querySelector('nav a[href="about.html"]').click();
  d.querySelector('nav a[href="archive.html"]').click();
  await tick();
  assert.equal(calls.length, 0);
});

test('halaman Contact tetap tampil sebagai fallback setelah klik', async () => {
  const { d, w } = await load();
  d.querySelector('nav a[href="#/contact"]').click();
  await tick();
  assert.equal(w.location.hash, '#/contact');
  assert.equal(d.querySelector('section[data-view="contact"]').hidden, false);
});

test('membuka langsung #/contact tidak otomatis memicu email', async () => {
  const { w, calls } = await load('#/contact');
  await tick();
  assert.equal(calls.length, 0);
  assert.equal(w.document.querySelector('section[data-view="contact"]').hidden, false);
});
