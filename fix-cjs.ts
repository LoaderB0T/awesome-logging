import fs from 'fs';

fs.writeFileSync(
  './lib/cjs/package.json',
  `{
  "type": "CommonJS"
}`
);
