# @zxvorx/scrape

Koleksi scraper siap pakai untuk Node.js — AI chat, download media (TikTok, YouTube, Facebook, X/Twitter, Spotify, Google Drive), pencarian (lagu, film, meme, gambar), stalk profil sosial media, tools gambar, dan lainnya.

Mendukung **CommonJS** dan **ESM**, plus bisa dipanggil langsung dari **terminal (CLI)** tanpa nulis kode.

## Instalasi

```bash
npm install @zxvorx/scrape
```

## Quick Start

```js
// CommonJS
const { gita } = require('@zxvorx/scrape');

(async () => {
  const jawaban = await gita('What is karma?');
  console.log(jawaban);
})();
```

```js
// ESM
import { gita } from '@zxvorx/scrape';

const jawaban = await gita('What is karma?');
console.log(jawaban);
```

---

## Daftar Scraper

### 🤖 AI & Teks

**`gita(pertanyaan)`** — tanya jawab AI.
```js
const jawaban = await gita('What is karma?');
```

**`deepai(prompt)`** — chat dengan DeepAI.
```js
const balasan = await deepai('halo, apa kabar?');
```

---

### 📥 Download Media

**`aio(url)`** — download video (TikTok, dll) tanpa watermark.
```js
const video = await aio('https://www.tiktok.com/@user/video/123');
console.log(video.medias); // daftar link download (HD, no watermark, audio, dll)
```

**`ytmp4(url, resolution)`** — download YouTube ke MP4.
```js
const video = await ytmp4('https://youtu.be/xxxxx', 480); // resolution opsional, default 360
console.log(video.download_url);
```

**`ytmp3(url, options)`** — download YouTube ke MP3.
```js
const audio = await ytmp3('https://youtu.be/xxxxx', { bitrate: '320k' });
console.log(audio.download_url);
```

**`facebookDownloader(url)`** — download video Facebook.
```js
const video = await facebookDownloader('https://facebook.com/watch/xxxxx');
console.log(video.downloadUrl, video.quality); // 'HD' atau 'SD'
```

**`twitterDownloader(url)`** — ambil video/gambar dari post X/Twitter.
```js
const media = await twitterDownloader('https://x.com/user/status/123');
console.log(media.videoUrl, media.mediaType);
```

**`spotifyDownload(url)`** — download track/album/playlist Spotify.
```js
const lagu = await spotifyDownload('https://open.spotify.com/track/xxxxx');
console.log(lagu.downloadUrl, lagu.metadata);

// Album/playlist otomatis di-download semua tracknya
const album = await spotifyDownload('https://open.spotify.com/album/xxxxx');
console.log(album.totalTracks, album.results);
```

**`gdrive(url)`** — ambil link download file Google Drive.
```js
const file = await gdrive('https://drive.google.com/file/d/xxxxx/view');
console.log(file.download);
```

---

### 🔍 Pencarian

**`spotifySearch(query)`** — cari lagu di Spotify.
```js
const hasil = await spotifySearch('brother sister');
```

**`pinterestSearch(query, limit)`** — cari gambar/pin Pinterest.
```js
const gambar = await pinterestSearch('minimalist room decor', 10);
```

**`watchpeakTitle(query, tab)`** — cari judul film/series.
```js
const film = await watchpeakTitle('Breaking Bad');
```

**`watchpeakPerson(query, role)`** — cari aktor/kru film.
```js
const aktor = await watchpeakPerson('Bob Odenkirk');
```

**`clipCafeSearch(quote, options)`** — cari klip film berdasarkan kutipan dialog.
```js
const klip = await clipCafeSearch("I'm not in danger, I'm the danger", { size: 20 });
```

**`findThatMeme(query, offset)`** — cari meme.
```js
const meme = await findThatMeme('Indonesia');
```

**`googleNews()`** — ambil satu berita acak terkini + konten lengkap.
```js
const berita = await googleNews();
```

**`berita()`** — ambil daftar berita terbaru dari Kompas.
```js
const daftarBerita = await berita();
```

---

### 👤 Stalk Profil

**`githubStalk(username)`**
```js
const profil = await githubStalk('octocat');
```

**`tiktokStalk(username)`**
```js
const profil = await tiktokStalk('mrbeast');
```

**`twitterStalk(username)`**
```js
const profil = await twitterStalk('@username'); // '@' opsional
console.log(profil.profile, profil.tweets);
```

---

### 🖼️ Tools Gambar

**`imageUpscale(imageUrl, scale)`** — upscale/perbesar resolusi gambar.
```js
const hasil = await imageUpscale('https://example.com/foto.jpg', 4);
```

**`imageHD(image, scale)`** — HD-in gambar (terima URL atau Buffer).
```js
const fs = require('fs');
const buffer = await imageHD('https://example.com/foto.jpg', 2);
fs.writeFileSync('hasil-hd.png', buffer);
```

**`bratMaker(text)`** — generate gambar teks gaya "brat" (Charli XCX).
```js
const fs = require('fs');
const buffer = await bratMaker('halo dunia');
fs.writeFileSync('brat.png', buffer);
```

---

### 📱 Lainnya

**`web2apk(url, appName, iconBuffer, options)`** — ubah website jadi APK.
```js
const fs = require('fs');
const icon = fs.readFileSync('./icon.png');

const apk = await web2apk('https://example.com', 'Nama App', icon, {
  versionName: '1.0.0',
  versionCode: 1,
});
console.log(apk.downloadUrl);
```

---

## API Key

Beberapa scraper (`aio`, `spotifyDownload` via theresav, `ytmp4`, `ytmp3`, `imageHD`) sudah punya **API key default bawaan** — langsung bisa dipakai tanpa setup apapun:

```js
const { aio } = require('@zxvorx/scrape');
const video = await aio('https://www.tiktok.com/@user/video/123'); // langsung jalan
```

Kalau mau pakai API key sendiri (misal karena kuota default lagi penuh):

```js
const { setApiKey } = require('@zxvorx/scrape');
setApiKey('theresav', 'API_KEY_KAMU');
```

---

## Konfigurasi (Opsional)

```js
const { setHttpConfig, setConcurrencyLimit, setDebug } = require('@zxvorx/scrape');

// Atur timeout, retry, rate limit request
setHttpConfig({ timeout: 15000, retries: 5 });

// Batasi berapa scraper boleh jalan bersamaan (default 5)
setConcurrencyLimit(3);

// Nyalain log debug (atau jalankan dengan env var: DEBUG=zxscrape)
setDebug(true);
```

Semuanya opsional — kalau gak di-set, semua scraper tetap jalan pakai nilai default yang sudah masuk akal.

---

## Lewat Terminal (CLI)

Semua scraper bisa dipanggil langsung tanpa nulis kode:

```bash
npx @zxvorx/scrape gita "What is karma?"
npx @zxvorx/scrape tiktokStalk mrbeast
npx @zxvorx/scrape ytmp4 https://youtu.be/xxxxx 480
npx @zxvorx/scrape bratMaker "halo dunia"

npx @zxvorx/scrape --help          # lihat semua scraper yang tersedia
npx @zxvorx/scrape --self-update   # update ke versi terbaru
```

Hasil berupa teks/data akan ditampilkan sebagai JSON. Hasil berupa gambar otomatis disimpan sebagai file `.png` di folder tempat command dijalankan.

---

## Catatan

- Semua fungsi bersifat **async** — selalu gunakan `await` atau `.then()`.
- Nama scraper **tidak case-sensitive** saat pakai `require()` atau CLI — `gita`, `Gita`, `GITA` semuanya jalan. (Named import ESM seperti `import { Gita }` tetap harus persis sesuai nama aslinya.)
- Package ini murni open-source, hasil dari komunitas — pastikan pemakaian tetap sesuai aturan masing-masing platform sumber data.

## Lisensi

MIT
