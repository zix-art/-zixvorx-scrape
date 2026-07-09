const cheerio = require('cheerio');
const { fetchResilient } = require('../utils/httpClient');

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36';

/**
 * Ambil info + link download video Facebook dari URL publik.
 * @param {string} url - link video Facebook
 */
async function facebookDownloader(url) {
  if (!url) throw new Error('Parameter url tidak boleh kosong');

  try {
    const response = await fetchResilient(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    let title =
      $('title').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      'Facebook Video';
    title = title.replace(/[\\/:*?"<>|]/g, '_').substring(0, 100);

    let hdUrl =
      $('meta[property="og:video"]').attr('content') ||
      $('meta[property="og:video:secure_url"]').attr('content');
    let sdUrl = null;

    $('script').each((_, el) => {
      const scriptContent = $(el).html() || '';
      if (scriptContent.includes('hd_src') || scriptContent.includes('sd_src')) {
        const hdMatch =
          scriptContent.match(/"hd_src":"([^"]+)"/) ||
          scriptContent.match(/"hd_src_no_rtt":"([^"]+)"/);
        const sdMatch =
          scriptContent.match(/"sd_src":"([^"]+)"/) ||
          scriptContent.match(/"sd_src_no_rtt":"([^"]+)"/);

        if (hdMatch) hdUrl = hdMatch[1].replace(/\\u0026/g, '&');
        if (sdMatch) sdUrl = sdMatch[1].replace(/\\u0026/g, '&');
      }
    });

    if (!hdUrl && !sdUrl) {
      const videoMatch = html.match(/"(https?:\/\/[^"]+\.mp4[^"]*)"/i);
      if (videoMatch) hdUrl = videoMatch[1];
    }

    const downloadUrl = hdUrl || sdUrl;
    if (!downloadUrl) throw new Error('Link video gak ketemu di halaman ini');

    return {
      title,
      hd: hdUrl || null,
      sd: sdUrl || null,
      downloadUrl,
      quality: hdUrl ? 'HD' : 'SD',
      originalUrl: url,
    };
  } catch (error) {
    throw new Error(`facebookDownloader scrape gagal: ${error.message}`);
  }
}

module.exports = facebookDownloader;
