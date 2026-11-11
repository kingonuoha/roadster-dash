const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SKIP_EXTS = new Set(['.bak', '.tmp']);
const SKIP_NAMES = new Set(['Robotaxi three.js', 'Thumbs.db', '.DS_Store']);

function copyDir(srcDir, dstDir) {
  let count = 0;
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (SKIP_NAMES.has(entry.name)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!entry.isDirectory() && SKIP_EXTS.has(ext)) continue;

    const src = path.join(srcDir, entry.name);
    const dst = path.join(dstDir, entry.name);
    if (entry.isDirectory()) {
      count += copyDir(src, dst);
    } else {
      fs.copyFileSync(src, dst);
      count++;
    }
  }
  return count;
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
let copied = 1;
copied += copyDir(path.join(ROOT, 'assets'), path.join(DIST, 'assets'));
copied += copyDir(path.join(ROOT, 'public'), DIST);

const required = [
  'index.html',
  'assets/game.js',
  'assets/game.css',
  'assets/app-path.js',
  'assets/auth-client.js',
  'manifest.webmanifest',
  'social-card.jpg',
  'images/veh-roadster.png',
  'images/veh-cybertruck.png',
  'images/veh-robotaxi.png',
  'images/cybertruck_ref.jpg',
  'icons/roadster-model-192.png',
  'items/ludicrous.png',
  'items/shockwave.png'
];

for (const rel of required) {
  const full = path.join(DIST, rel);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    throw new Error(`Build verification failed: missing dist/${rel}`);
  }
}

console.log(`Built Tesla-Dash static bundle into dist/ (${copied} files verified).`);
