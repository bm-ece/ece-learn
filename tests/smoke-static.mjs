import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const css = read('css/styles.css');
const app = read('js/app.js');

function check(name, fn) {
  try { fn(); console.log('PASS', name); }
  catch (error) { console.error('FAIL', name, error.message); process.exitCode = 1; }
}

check('Application JavaScript parses', () => new Script(app, { filename: 'js/app.js' }));
check('HTML loads the stylesheet and application exactly once', () => {
  assert.equal((html.match(/<link rel="stylesheet" href="css\/styles\.css">/g) || []).length, 1);
  assert.equal((html.match(/<script src="js\/app\.js"><\/script>/g) || []).length, 1);
  assert.equal((html.match(/<script\b/g) || []).length, 1);
  assert.equal((html.match(/<style\b/g) || []).length, 0);
  assert.equal((html.match(/<\/script>/g) || []).length, 1);
});
check('Stylesheet and branding assets exist', () => {
  assert.ok(css.length > 10000);
  assert.ok(existsSync(new URL('../assets/favicon.svg', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/ece-logo.jpg', import.meta.url)));
});
check('Linux teaching dataset remains intact', () => {
  const match = app.match(/^\s*const DATA=(\{.*?\});\s*const COMMANDS=/s);
  assert.ok(match, 'DATA declaration must be available before COMMANDS');
  const data = JSON.parse(match[1]);
  assert.ok(Array.isArray(data.commands) && data.commands.length > 0);
  assert.ok(Array.isArray(data.parts) && data.parts.length === 7);
  assert.ok(data.parts.every(part => part && typeof part === 'object'));
});
check('Preview progress key is distinct from production', () => {
  assert.ok(app.includes("location.pathname.startsWith('/linux-nexus-preview/')"));
  assert.ok(app.includes("'linux_nexus_preview_complete_2026'"));
  assert.ok(app.includes("'linux_nexus_complete_2026'"));
});
check('Interactive entry points remain present', () => {
  for (const name of ['render', 'terminalView', 'submitCommand', 'labView', 'submitLab', 'simView', 'progressView']) {
    assert.match(app, new RegExp('function\\s+' + name + '\\s*\\('), name);
  }
  assert.match(app, /\brender\(\);/);
});
