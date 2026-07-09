const { fetchResilient } = require('../utils/httpClient');

const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36';

/**
 * Stalk profil + tweets terbaru user X/Twitter via archivlyx.com.
 * @param {string} username
 * @param {string} [cursor=''] - buat pagination, ambil dari nextCursor hasil sebelumnya
 */
async function twitterStalk(username, cursor = '') {
  if (!username) throw new Error('Parameter username wajib diisi');

  const cleanUsername = username.replace('@', '');
  const url = `https://www.archivlyx.com/api/x/user-tweets?username=${encodeURIComponent(cleanUsername)}&cursor=${encodeURIComponent(cursor)}`;

  try {
    const response = await fetchResilient(url, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': USER_AGENT,
        Referer: `https://www.archivlyx.com/x/user/${cleanUsername}`,
        Origin: 'https://www.archivlyx.com',
      },
    });
    const resData = await response.json();

    if (!resData || !resData.success) {
      throw new Error('Gagal mengambil data dari API Archivlyx');
    }

    const userData = resData.data.user;
    const tweetsData = resData.data.tweets || [];

    const tweets = tweetsData.map((tweet) => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.createdAt,
      isRetweet: tweet.isRetweet || false,
      isQuote: tweet.isQuote || false,
      stats: {
        likes: tweet.stats?.likes || 0,
        retweets: tweet.stats?.retweets || 0,
        replies: tweet.stats?.replies || 0,
        views: tweet.stats?.views || 0,
        bookmarks: tweet.stats?.bookmarks || 0,
      },
      media: (tweet.media || []).map((m) => ({
        type: m.type,
        thumbnail: m.url,
        downloadUrl: m.videoUrl || m.url,
      })),
      quotedFrom: tweet.quotedTweet
        ? {
            id: tweet.quotedTweet.id,
            text: tweet.quotedTweet.text,
            author: tweet.quotedTweet.author?.handle,
          }
        : null,
    }));

    return {
      profile: {
        name: userData.displayName,
        handle: userData.handle,
        isVerified: userData.isVerified,
        bio: userData.bio,
        location: userData.location,
        followers: userData.followersCount,
        following: userData.followingCount,
        avatar: userData.avatar,
        banner: userData.banner,
      },
      tweets,
      nextCursor: resData.data.nextCursor || null,
    };
  } catch (error) {
    throw new Error(`twitterStalk scrape gagal: ${error.message}`);
  }
}

module.exports = twitterStalk;
