const cheerio = require('cheerio');
const { fetchResilient } = require('../utils/httpClient');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function decodeGoogleNewsUrl(googleRssUrl) {
  try {
    const idMatch = googleRssUrl.match(/\/articles\/([^?]+)/);
    if (!idMatch) return googleRssUrl;
    const id = idMatch[1];

    const articlePage = await fetchResilient(`https://news.google.com/articles/${id}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const html = await articlePage.text();

    const sigMatch = html.match(/data-n-a-sg="([^"]+)"/);
    const tsMatch = html.match(/data-n-a-ts="([^"]+)"/);
    if (!sigMatch || !tsMatch) return googleRssUrl;

    const signature = sigMatch[1];
    const timestamp = tsMatch[1];

    const reqPayload = [
      'Fbv4je',
      `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${id}","${timestamp}","${signature}"]`,
    ];
    const payload = new URLSearchParams({ 'f.req': JSON.stringify([[reqPayload]]) });

    const response = await fetchResilient(
      'https://news.google.com/_/DotsSplashUi/data/batchexecute?rpcids=Fbv4je',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'User-Agent': USER_AGENT,
        },
        body: payload.toString(),
      }
    );

    const raw = await response.text();
    const cleanData = raw.replace(")]}'\n\n", '');
    const data = JSON.parse(cleanData);
    const nestedString = data[0][2];
    if (nestedString) return JSON.parse(nestedString)[1];
  } catch (error) {
    console.warn(`[googleNews] decode url gagal: ${error.message}`);
  }
  return googleRssUrl;
}

async function fetchArticleContent(url) {
  try {
    const response = await fetchResilient(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    let imageUrl =
      $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
    if (imageUrl && !imageUrl.startsWith('http')) {
      try {
        imageUrl = new URL(imageUrl, url).toString();
      } catch (_) {
        imageUrl = null;
      }
    }

    $('script, style, head, header, footer, nav, iframe, noscript').remove();

    const paragraphs = [];
    $('p').each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 40 && !text.includes('Baca juga:') && !text.includes('Simak Video')) {
        paragraphs.push(text);
      }
    });

    return { text: paragraphs.slice(0, 10).join('\n\n'), imageUrl: imageUrl || null };
  } catch (error) {
    console.warn(`[googleNews] fetch artikel gagal: ${error.message}`);
    return { text: '', imageUrl: null };
  }
}

/**
 * Ambil satu berita acak terkini dari Google News RSS Indonesia beserta konten lengkapnya.
 */
async function googleNews() {
  try {
    const rssResponse = await fetchResilient('https://news.google.com/rss?hl=id&gl=ID&ceid=ID:id', {
      headers: { 'User-Agent': USER_AGENT },
    });
    const xml = await rssResponse.text();

    const items = [];
    const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of matches) {
      const content = match[1];
      const title = content.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
      const link = content.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const pubDate = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      const source = content.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || '';
      items.push({ title, link, pubDate, source });
    }

    if (items.length === 0) {
      throw new Error('Gagal mendapatkan daftar berita terkini dari RSS');
    }

    const item = items[Math.floor(Math.random() * items.length)];
    const decodedUrl = await decodeGoogleNewsUrl(item.link);
    const { text, imageUrl } = await fetchArticleContent(decodedUrl);

    let domain = 'news.google.com';
    try {
      domain = new URL(decodedUrl).hostname.replace('www.', '');
    } catch (_) {}

    return {
      title: item.title,
      source: item.source || domain,
      pubDate: item.pubDate,
      originalUrl: decodedUrl,
      faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      imageUrl,
      contentSnippet: text,
    };
  } catch (error) {
    throw new Error(`googleNews scrape gagal: ${error.message}`);
  }
}

module.exports = googleNews;
