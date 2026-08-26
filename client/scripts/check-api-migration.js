/**
 * Пункт 9 миграции API: статический grep-check.
 *
 * Запуск из client/:  npm run check:api
 *
 * Что проверяем (в живом коде, комментарии игнорируются):
 *   1. localhost:3000 / 127.0.0.1:3000 — только в config/api.js (API_BASE)
 *   2. import axios — только в config/http.js
 *   3. axios.get/post/... — не в компонентах/страницах/контекстах
 *   4. fetch(...) к API — запрещён (остаётся только http)
 *   5. setupApiClient — файл и упоминания в коде отсутствуют
 *
 * Smoke (ручной обход экранов) — см. комментарий в config/http.js.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

const ALLOW_LOCALHOST = new Set([
  path.normalize('config/api.js'),
]);
const ALLOW_AXIOS_IMPORT = new Set([
  path.normalize('config/http.js'),
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'local-rfs') continue;
      walk(full, files);
    } else if (/\.(js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

/** Убирает // и /* *\/ комментарии, чтобы не ловить «было: localhost» в JSDoc. */
function stripComments(source) {
  let out = '';
  let i = 0;
  const n = source.length;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;

  while (i < n) {
    const c = source[i];
    const next = source[i + 1];

    if (inLineComment) {
      if (c === '\n') {
        inLineComment = false;
        out += c;
      }
      i += 1;
      continue;
    }
    if (inBlockComment) {
      if (c === '*' && next === '/') {
        inBlockComment = false;
        i += 2;
        continue;
      }
      i += 1;
      continue;
    }

    if (!inSingle && !inDouble && !inTemplate) {
      if (c === '/' && next === '/') {
        inLineComment = true;
        i += 2;
        continue;
      }
      if (c === '/' && next === '*') {
        inBlockComment = true;
        i += 2;
        continue;
      }
    }

    if (!inDouble && !inTemplate && c === "'" && source[i - 1] !== '\\') {
      inSingle = !inSingle;
    } else if (!inSingle && !inTemplate && c === '"' && source[i - 1] !== '\\') {
      inDouble = !inDouble;
    } else if (!inSingle && !inDouble && c === '`' && source[i - 1] !== '\\') {
      inTemplate = !inTemplate;
    }

    out += c;
    i += 1;
  }
  return out;
}

function rel(file) {
  return path.normalize(path.relative(SRC, file));
}

const violations = [];

for (const file of walk(SRC)) {
  const relative = rel(file);
  const raw = fs.readFileSync(file, 'utf8');
  const code = stripComments(raw);
  const lines = code.split(/\r?\n/);

  lines.forEach((line, idx) => {
    const lineNo = idx + 1;
    const add = (rule, detail) => {
      violations.push({ file: relative, line: lineNo, rule, detail: detail || line.trim() });
    };

    if (/(localhost|127\.0\.0\.1):3000/.test(line) && !ALLOW_LOCALHOST.has(relative)) {
      add('hardcoded-host', line.trim());
    }

    if (/from\s+['"]axios['"]|require\(\s*['"]axios['"]\s*\)/.test(line)) {
      if (!ALLOW_AXIOS_IMPORT.has(relative)) {
        add('axios-import', line.trim());
      }
    }

    if (/\baxios\.(get|post|put|patch|delete|request|create)\s*\(/.test(line)) {
      if (relative !== path.normalize('config/http.js')) {
        add('axios-call', line.trim());
      }
    }

    if (/\bfetch\s*\(/.test(line)) {
      add('fetch-call', line.trim());
    }

    if (/\bsetupApiClient\b/.test(line)) {
      add('setupApiClient', line.trim());
    }
  });

  if (relative === path.normalize('config/setupApiClient.js')) {
    violations.push({
      file: relative,
      line: 1,
      rule: 'setupApiClient-file',
      detail: 'Файл должен быть удалён',
    });
  }

  if (/copy\.js$/i.test(path.basename(file)) || /\scopy\./i.test(path.basename(file))) {
    violations.push({
      file: relative,
      line: 1,
      rule: 'orphan-copy',
      detail: 'Дубликат/copy-файл — удалить',
    });
  }
}

if (violations.length === 0) {
  console.log('OK: пункт 9 grep — живой код без хардкода localhost, axios в UI, fetch(API), setupApiClient.');
  console.log('Дальше: smoke по экранам (см. client/src/config/http.js).');
  process.exit(0);
}

console.error(`FAIL: найдено нарушений: ${violations.length}\n`);
for (const v of violations) {
  console.error(`  [${v.rule}] ${v.file}:${v.line}`);
  console.error(`    ${v.detail}\n`);
}
process.exit(1);
