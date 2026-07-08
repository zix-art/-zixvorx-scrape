async function tiktoksearch(query, page = 1) {
  const baseUrl = "https://www.t1kt0k-lite.zone.id/api/search";
  
  const url = new URL(baseUrl);
  url.searchParams.append("query", query);
  url.searchParams.append("page", page.toString());

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json"
  };

  console.log(`Mencari data untuk query: '${query}' di halaman: ${page}...`);

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data:", error.message);
    return null;
  }
}

module.exports = tiktoksearch;