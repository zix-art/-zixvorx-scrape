const { fetchResilient } = require('../utils/httpClient');

async function deepai(prompt) {
  const url = 'https://api.deepai.org/hacking_is_a_serious_crime';

  const headers = {
    'api-key': 'tryit-84303483976-293520c15ccc5fada63d9e51c4639dbb',
    'User-Agent':
      'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Mobile Safari/537.36',
    Accept: '*/*',
    Origin: 'https://deepai.org',
    Referer: 'https://deepai.org/chat',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const chatHistory = JSON.stringify([{ role: 'user', content: prompt }]);

  const payload = new URLSearchParams();
  payload.append('chat_style', 'chat');
  payload.append('chatHistory', chatHistory);

  try {
    const response = await fetchResilient(url, {
      method: 'POST',
      headers,
      body: payload.toString(),
    });

    return await response.text();
  } catch (error) {
    return `Terjadi error: ${error.message}`;
  }
}

module.exports = deepai;
