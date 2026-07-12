const { fetchResilient } = require('../utils/httpClient');

const BASE_URL = 'https://api.watchpeak.app/search';
const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36';

/**
 * Cari judul film/series di Watchpeak.
 * @param {string} query
 * @param {string} [tab='all']
 */
async function watchpeakTitle(query, tab = 'all') {
  if (!query) throw new Error('Query judul wajib diisi');

  const url = new URL(BASE_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('language', 'en');
  url.searchParams.set('mode', 'title');
  url.searchParams.set('tab', tab);
  url.searchParams.set('region', 'ID');

  try {
    const response = await fetchResilient(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
    });
    const data = await response.json();

    return data.map((item) => ({
      id: item.id,
      title: item.title || item.name,
      name: item.name || item.original_name,
      originalTitle: item.original_title || item.original_name,
      mediaType: item.media_type,
      resultType: item.result_type,
      overview: item.overview,
      popularity: item.popularity,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      releaseDate: item.release_date || item.first_air_date,
      firstAirDate: item.first_air_date,
      voteAverage: item.vote_average,
      voteCount: item.vote_count,
      genreIds: item.genre_ids,
      originCountry: item.origin_country,
      originalLanguage: item.original_language,
      adult: item.adult,
      video: item.video,
      isMovieCollection: item.is_movie_collection,
      belongsToCollectionId: item.belongs_to_collection_id,
      collectionName: item.collection_name,
    }));
  } catch (error) {
    throw new Error(`watchpeakTitle scrape gagal: ${error.message}`);
  }
}

module.exports = watchpeakTitle;
