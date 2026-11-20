import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = read('linux/index.html');
const portal = read('index.html');
const css = read('css/styles.css');
const app = read('js/app.js');
const storage = read('js/storage.js');
const progress = read('js/progress.js');

function check(name, fn) {
  try { fn(); console.log('PASS', name); }
  catch (error) { console.error('FAIL', name, error.message); process.exitCode = 1; }
}

check('All referenced local JavaScript files exist and parse', () => {
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/script>/g)].map(match => match[1].replace(/^\.\.\//, ''));
  assert.deepEqual(scripts, ['js/data/linux.js', 'js/data/labs.js', 'js/data/terminal-fs.js', 'js/simulators.js', 'js/routing.js', 'js/storage.js', 'js/progress.js', 'js/app.js'], 'Unexpected script loading sequence');
  for (const path of scripts) {
    assert.ok(!path.startsWith('/') && !path.includes('..'), 'Unsafe script path');
    assert.ok(existsSync(new URL('../' + path, import.meta.url)), 'Missing script: ' + path);
    new Script(read(path), { filename: path });
  }
});
check('HTML loads the stylesheet and application exactly once', () => {
  assert.equal((html.match(/<link\\b(?=[^>]*\\brel="stylesheet")(?=[^>]*\\bhref="\\.\\.\\/css\\/styles\\.css")[^>]*>/g) || []).length, 1);
  assert.equal((html.match(/<script\\b[^>]*\\bsrc="\\.\\.\\/js\\/app\\.js"[^>]*>\\s*<\\/script>/g) || []).length, 1);
  assert.equal((html.match(/<script\b/g) || []).length, 8);
  assert.equal((html.match(/<style\b/g) || []).length, 0);
  assert.equal((html.match(/<\/script>/g) || []).length, 8);
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
  assert.ok(storage.includes("location.pathname.startsWith('/linux-nexus-preview/')"));
  assert.ok(storage.includes("'linux_nexus_preview_complete_2026'"));
  assert.ok(storage.includes("'linux_nexus_complete_2026'"));
  assert.ok(app.includes('window.ECE_STORAGE.load()'));
  assert.ok(app.includes('window.ECE_STORAGE.save('));
  const memory = new Map();
  const makeContext = pathname => {
    const context = {
      window: {}, location: { pathname },
      localStorage: {
        getItem: key => memory.get(key) ?? null,
        setItem: (key, value) => memory.set(key, value)
      }
    };
    runInNewContext(storage, context);
    return context.window.ECE_STORAGE;
  };
  const prod = makeContext('/linux-nexus/linux/');
  const preview = makeContext('/linux-nexus-preview/linux/');
  prod.save({ done: [1], labDone: [], labStarted: [], attempts: {}, fs: {} });
  preview.save({ done: [2], labDone: [], labStarted: [], attempts: {}, fs: {} });
  assert.deepEqual(Array.from(prod.load().done), [1]);
  assert.deepEqual(Array.from(preview.load().done), [2]);
  assert.ok(memory.has('linux_nexus_complete_2026'));
  assert.ok(memory.has('linux_nexus_preview_complete_2026'));
  memory.set('linux_nexus_preview_complete_2026', '{invalid');
  assert.equal(Object.keys(preview.load()).length, 0, 'Malformed data should not crash startup');
});
check('Interactive entry points remain present', () => {
  for (const name of ['render', 'terminalView', 'submitCommand', 'labView', 'submitLab', 'progressView']) {
    assert.match(app, new RegExp(String.raw`function\s+${name}\s*\(`), name);
  }
  assert.match(app, /\brender\(\);/);
});

check('No missing local stylesheet or image references', () => {
  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)].map(match => match[1].replace(/^\.\.\//, ''));
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

check('Progress calculations preserve XP and domain counts', () => {
  const context = { window: {} };
  runInNewContext(progress, context);
  const api = context.window.ECE_PROGRESS;
  const state = { done: new Set([0, 2]), labDone: new Set([0]) };
  const summary = api.summary(state, 79);
  assert.equal(summary.notions, 2);
  assert.equal(summary.labs, 1);
  assert.equal(summary.xp, 200);
  assert.equal(api.summary({ done: new Set(), labDone: new Set() }, 79).xp, 0);
  const domains = api.byDomain([{ title: 'A' }, { title: 'B' }], [{ part: 0 }, { part: 1 }, { part: 0 }], state.done);
  assert.deepEqual(Array.from(domains, item => Array.from(item).slice(1)), [[2, 2], [1, 0]]);
  assert.ok(app.includes('window.ECE_PROGRESS.summary('));
  assert.ok(app.includes('window.ECE_PROGRESS.byDomain('));
});

check('ECE Learn catalog lists four subjects without premature links', () => {
  const context = { window: {} };
  new Script(read('js/catalog.js'), { filename: 'js/catalog.js' }).runInNewContext(context);
  const courses = context.window.ECE_CATALOG;
  assert.equal(courses.length, 4);
  assert.deepEqual(Array.from(courses, course => course.id), ['linux', 'networks', 'programming', 'cybersecurity']);
  assert.equal(courses.filter(course => course.available).length, 1);
  assert.equal(courses[0].title, 'Linux');
  assert.ok(courses.every(course => typeof course.description === 'string' && course.description.length > 0));
  assert.ok(courses.every(course => course.path === null), 'No unpublished course route should be advertised');
});

check('ECE Learn portal and Linux entry point exist', () => {
  assert.ok(portal.includes('ECE Learn'));
  assert.ok(portal.includes('Votre espace d\'apprentissage interactif'));
  assert.ok(portal.includes('js/catalog.js') && portal.includes('js/portal.js'));
  assert.ok(existsSync(new URL('../linux/index.html', import.meta.url)));
  assert.ok(existsSync(new URL('../css/portal.css', import.meta.url)));
  new Script(read('js/portal.js'));
  const linux = read('linux/index.html');
  assert.ok(linux.includes('../js/app.js'));
  assert.ok(linux.includes('../css/styles.css'));
});
