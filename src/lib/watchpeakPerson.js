const { fetchResilient } = require('../utils/httpClient');

const BASE_URL = 'https://api.watchpeak.app/search';
const USER_AGENT =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36';

/**
 * Cari aktor/kru (person) di Watchpeak.
 * @param {string} query
 * @param {string} [personRole='all']
 */
async function watchpeakPerson(query, personRole = 'all') {
  if (!query) throw new Error('Nama person wajib diisi');

  const url = new URL(BASE_URL);
  url.searchParams.set('q', query);
  url.searchParams.set('language', 'en');
  url.searchParams.set('mode', 'person');
  url.searchParams.set('personRole', personRole);
  url.searchParams.set('region', 'ID');

  try {
    const response = await fetchResilient(url.toString(), {
      headers: { 'User-Agent': USER_AGENT },
    });
    const data = await response.json();

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      resultType: item.result_type,
      profilePath: item.profile_path,
      knownForDepartment: item.known_for_department,
      popularity: item.popularity,
      roles: item.roles,
      roleLabels: item.role_labels,
      knownForText: item.known_for_text,
      knownFor: (item.known_for || []).map((kf) => ({
        id: kf.id,
        title: kf.title || kf.name,
        name: kf.name,
        mediaType: kf.media_type,
        resultType: kf.result_type,
        overview: kf.overview,
        popularity: kf.popularity,
        posterPath: kf.poster_path,
        backdropPath: kf.backdrop_path,
        releaseDate: kf.release_date,
        firstAirDate: kf.first_air_date,
        voteAverage: kf.vote_average,
        voteCount: kf.vote_count,
      })),
    }));
  } catch (error) {
    throw new Error(`watchpeakPerson scrape gagal: ${error.message}`);
  }
}

module.exports = watchpeakPerson;
