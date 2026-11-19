import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('index.html');
const css = read('css/styles.css');
const app = read('js/app.js');

function check(name, fn) {
  try { fn(); console.log('PASS', name); }
  catch (error) { console.error('FAIL', name, error.message); process.exitCode = 1; }
}

check('All referenced local JavaScript files exist and parse', () => {
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/g)].map(match => match[1]);
  assert.deepEqual(scripts, ['js/data/linux.js', 'js/data/labs.js', 'js/data/terminal-fs.js', 'js/simulators.js', 'js/app.js'], 'Unexpected script loading sequence');
  for (const path of scripts) {
    assert.ok(!path.startsWith('/') && !path.includes('..'), 'Unsafe script path');
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'Missing script: ' + path);
    new Script(read(path), { filename: path });
  }
});
check('HTML loads the stylesheet and application exactly once', () => {
  assert.equal((html.match(/<link rel="stylesheet" href="css\/styles\.css">/g) || []).length, 1);
  assert.equal((html.match(/<script src="js\/app\.js"><\/script>/g) || []).length, 1);
  assert.equal((html.match(/<script\b/g) || []).length, 5);
  assert.equal((html.match(/<style\b/g) || []).length, 0);
  assert.equal((html.match(/<\/script>/g) || []).length, 5);
});
check('Stylesheet and branding assets exist', () => {
  assert.ok(css.length > 10000);
  assert.ok(existsSync(new URL('../assets/favicon.svg', import.meta.url)));
  assert.ok(existsSync(new URL('../assets/ece-logo.jpg', import.meta.url)));
});
check('Linux teaching dataset remains intact', () => {
  const source = read('js/data/linux.js').trim();
  const prefix = 'window.LINUX_NEXUS_DATA=';
  assert.ok(source.startsWith(prefix) && source.endsWith(';'), 'Linux dataset must be assigned before application startup');
  assert.ok(app.includes('const DATA=window.LINUX_NEXUS_DATA;'));
  const data = JSON.parse(source.slice(prefix.length, -1));
  assert.ok(Array.isArray(data.commands) && data.commands.length === 79, '79 Linux commands must remain');
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
    assert.match(app, new RegExp(String.raw`function\s+${name}\s*\(`), name);
  }
  assert.match(app, /\brender\(\);/);
});

check('No missing local stylesheet or image references', () => {
  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1]);
  for (const path of references) {
    if (/^(https?:|mailto:|#|data:)/.test(path)) continue;
    assert.ok(!path.startsWith('/') && !path.includes('..'), 'Invalid relative path: ' + path);
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'Missing local file: ' + path);
  }
});
check('Interactive lessons, labs and simulators remain defined', () => {
  const context = { window: {} };
  runInNewContext(read('js/data/labs.js'), context);
  assert.equal(context.window.LINUX_NEXUS_LABS.length, 7, 'Seven labs must remain');
  assert.ok(context.window.LINUX_NEXUS_LABS.every(lab => lab.title && lab.story && Array.isArray(lab.steps) && lab.steps.length > 0));
  assert.ok(app.includes('const LABS=window.LINUX_NEXUS_LABS;'));
  const terminalContext = { window: {} };
  runInNewContext(read('js/data/terminal-fs.js'), terminalContext);
  assert.ok(terminalContext.window.LINUX_NEXUS_INITIAL_FS['/home/student']);
  assert.ok(terminalContext.window.LINUX_NEXUS_INITIAL_FS['/etc/passwd']);
  assert.ok(app.includes('const initialFS=window.LINUX_NEXUS_INITIAL_FS;'));
  assert.match(app, /\bfunction lesson\s*\(/);
  assert.match(app, /\bfunction checkQuiz\s*\(/);
  assert.match(app, /\bfunction runScript\s*\(/);
  assert.match(read('js/simulators.js'), /\bfunction simContent\s*\(/);
  assert.match(read('js/simulators.js'), /\bfunction simView\s*\(/);
  for (const name of ['process', 'permissions', 'memory', 'network']) assert.ok(read('js/simulators.js').includes(name));
});
