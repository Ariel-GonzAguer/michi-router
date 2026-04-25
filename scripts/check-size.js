const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const limits = [
  { file: 'dist/core.mjs', maxGzipBytes: 1800 },
  { file: 'dist/index.mjs', maxGzipBytes: 2300 }
];

let hasError = false;

for (const { file, maxGzipBytes } of limits) {
  const filePath = path.resolve(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.error(`Missing bundle file: ${file}`);
    hasError = true;
    continue;
  }

  const source = fs.readFileSync(filePath);
  const gzipSize = zlib.gzipSync(source, { level: 9 }).length;

  if (gzipSize > maxGzipBytes) {
    console.error(`Size budget exceeded for ${file}: ${gzipSize} B gzip (max ${maxGzipBytes} B)`);
    hasError = true;
  } else {
    console.log(`Size OK for ${file}: ${gzipSize} B gzip (max ${maxGzipBytes} B)`);
  }
}

if (hasError) {
  process.exit(1);
}
