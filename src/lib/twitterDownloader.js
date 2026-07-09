const cheerio = require('cheerio');
const { fetchResilient } = require('../utils/httpClient');

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36';

/**
 * Ambil info + link video dari post X/Twitter publik.
 * @param {string} url
 */
async function twitterDownloader(url) {
  if (!url) throw new Error('Parameter url tidak boleh kosong');

  try {
    const response = await fetchResilient(url, {
      headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'id-ID,id;q=0.9,en;q=0.8' },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text().trim();
    const description = $('meta[property="og:description"]').attr('content') || '';
    const thumbnail = $('meta[property="og:image"]').attr('content') || null;

    let videoUrl =
      $('meta[property="og:video"]').attr('content') ||
      $('meta[property="og:video:url"]').attr('content') ||
      null;

    if (!videoUrl) {
      $('script').each((_, el) => {
        const content = $(el).html() || '';

        const match =
          content.match(/"video_url":"(https:\/\/[^"]+\.mp4[^"]*)"/) ||
          content.match(/"(https:\/\/video\.twimg\.com\/[^"]+\.mp4[^"]*)"/) ||
          content.match(/"content_url":"(https:\/\/[^"]+\.mp4[^"]*)"/);

        if (match) videoUrl = match[1].replace(/\\u0026/g, '&');

        if (!videoUrl && content.includes('amplify_video')) {
          const ampMatch = content.match(/"url":"(https:\/\/[^"]+amplify_video[^"]+\.mp4[^"]*)"/);
          if (ampMatch) videoUrl = ampMatch[1].replace(/\\u0026/g, '&');
        }
      });
    }

    let mediaType = 'text';
    if (videoUrl) mediaType = 'video';
    else if (thumbnail && (thumbnail.includes('media') || thumbnail.includes('twimg'))) {
      mediaType = 'image';
    }

    return {
      platform: 'X/Twitter',
      title: title ? title.substring(0, 200) : 'Twitter Post',
      description,
      videoUrl,
      thumbnail,
      mediaType,
      originalUrl: url,
    };
  } catch (error) {
    throw new Error(`twitterDownloader scrape gagal: ${error.message}`);
  }
}

module.exports = twitterDownloader;
