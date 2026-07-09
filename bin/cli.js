#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const scrapers = require('../src/index.js');
const { checkForUpdates, selfUpdate } = require('../src/utils/selfUpdate');

const libDir = path.join(__dirname, '../src/lib');
const availableNames = fs
  .readdirSync(libDir)
  .filter((f) => f.endsWith('.js'))
  .map((f) => path.basename(f, '.js'));

// Cek update di background (non-blocking, gak nunggu, gak ganggu stdout JSON).
// Kalau gagal (misal offline) diem aja, ini bukan hal kritis.
checkForUpdates()
  .then(({ hasUpdate, current, latest }) => {
    if (hasUpdate && latest) {
      console.error(
        `\n📦 Update tersedia: ${current} → ${latest}\n   Jalankan: npx @zxvorx/scrape --self-update\n`
      );
    }
  })
  .catch(() => {});

function printHelp() {
  console.log('Penggunaan: npx @zxvorx/scrape <scraper> [argumen...]\n');
  console.log('Scraper tersedia:');
  availableNames.forEach((name) => console.log(`  - ${name}`));
  console.log('\nContoh:');
  console.log('  npx @zxvorx/scrape gita "What is karma?"');
  console.log('  npx @zxvorx/scrape tiktokStalk mrbeast');
  console.log('  npx @zxvorx/scrape ytmp4 https://youtu.be/xxx 480');
  console.log('  npx @zxvorx/scrape ytmp3 https://youtu.be/xxx mp3 320k');
  console.log('  npx @zxvorx/scrape web2apk https://google.com "Google App" ./icon.png');
  console.log('\nLainnya:');
  console.log('  npx @zxvorx/scrape --self-update   # update ke versi terbaru');
}

/**
 * Beberapa scraper butuh argumen non-string (Buffer, object options).
 * Handle case khusus di sini, sisanya pass-through apa adanya sebagai string.
 */
function buildArgs(scraperName, args) {
  if (scraperName === 'web2apk') {
    const [url, appName, iconPath] = args;
    if (!iconPath) throw new Error('web2apk butuh path file icon sebagai argumen ke-3');
    const iconBuffer = fs.readFileSync(iconPath);
    return [url, appName, iconBuffer];
  }

  if (scraperName === 'ytmp3') {
    const [url, format, bitrate] = args;
    return [url, { format, bitrate }];
  }

  return args;
}

async function main() {
  const [scraperNameRaw, ...args] = process.argv.slice(2);

  if (!scraperNameRaw || scraperNameRaw === '--help' || scraperNameRaw === '-h') {
    printHelp();
    process.exit(0);
  }

  if (scraperNameRaw === '--self-update') {
    selfUpdate();
    process.exit(0);
  }

  const matchedName = availableNames.find(
    (n) => n.toLowerCase() === scraperNameRaw.toLowerCase()
  );

  if (!matchedName) {
    console.error(`Scraper '${scraperNameRaw}' gak ditemukan.\n`);
    printHelp();
    process.exit(1);
  }

  try {
    const callArgs = buildArgs(matchedName, args);
    const result = await scrapers[matchedName](...callArgs);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
