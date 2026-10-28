const fs = require('node:fs');
const path = require('node:path');
// Header-only CSVs contain obsolete columns and no seed data.
const dir = 'gen/db/src/gen/data';
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith('.csv')) continue;
  const file = path.join(dir, name);
  if (fs.readFileSync(file, 'utf8').trim().split(/\r?\n/).length > 1) continue;
  fs.rmSync(file);
  fs.rmSync(file.replace(/\.csv$/, '.hdbtabledata'), { force: true });
}
