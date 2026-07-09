const { fetchResilient } = require('../utils/httpClient');

const BASE_URL = 'https://spotyloader.com/api/spotify';
const USER_AGENT = 'Mozilla/5.0';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadTrack(trackUrl) {
  const startRes = await fetchResilient(`${BASE_URL}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
    body: JSON.stringify({ url: trackUrl }),
  });
  const startData = await startRes.json();

  const jobId = startData.jobId;
  if (!jobId) return { error: 'Failed to get job ID from server', url: trackUrl };

  for (let i = 0; i < 20; i++) {
    await sleep(3000);

    const statusRes = await fetchResilient(`${BASE_URL}/track/status/${jobId}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const data = await statusRes.json();

    if (data.status === 'ready' || data.status === 'success') {
      const downloadUrl = data.downloadLink || data.downloadUrl || data.post?.download_url;
      if (downloadUrl) {
        return {
          downloadUrl,
          metadata: data.post
            ? {
                title: data.post.name,
                artist: data.post.artist,
                album: data.post.album,
                image: data.post.image,
              }
            : null,
        };
      }
    } else if (data.status === 'error' || data.status === 'failed') {
      return { error: 'Conversion failed on server', url: trackUrl };
    }
  }

  return { error: 'Timeout waiting for conversion', url: trackUrl };
}

/**
 * Download track/album/playlist Spotify (via spotyloader.com).
 * Album/playlist di-download batch (3 track sekaligus, jeda 2 detik antar batch).
 * @param {string} spotifyUrl
 */
async function spotifyDownload(spotifyUrl) {
  if (!spotifyUrl) throw new Error('Parameter url tidak boleh kosong');

  try {
    if (spotifyUrl.includes('/album/') || spotifyUrl.includes('/playlist/')) {
      const type = spotifyUrl.includes('/album/') ? 'album' : 'playlist';

      const res = await fetchResilient(`${BASE_URL}/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': USER_AGENT },
        body: JSON.stringify({ url: spotifyUrl }),
      });
      const data = await res.json();
      const tracks = data.post?.tracks || [];

      if (tracks.length === 0) throw new Error('No tracks found in the album/playlist');

      const results = [];
      const batchSize = 3;
      for (let i = 0; i < tracks.length; i += batchSize) {
        const batch = tracks.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map((t) => downloadTrack(t.url)));
        results.push(...batchResults);
        if (i + batchSize < tracks.length) await sleep(2000);
      }

      return { type, title: data.post.name, totalTracks: tracks.length, results };
    }

    return await downloadTrack(spotifyUrl);
  } catch (error) {
    throw new Error(`spotifyDownload scrape gagal: ${error.message}`);
  }
}

module.exports = spotifyDownload;
