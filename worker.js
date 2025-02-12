// Cloudflare Worker code
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  const searchParams = url.searchParams;

  const tmdbUrl = new URL(TMDB_BASE_URL + path);
  searchParams.forEach((value, key) => {
    tmdbUrl.searchParams.append(key, value);
  });

  const response = await fetch(tmdbUrl.toString(), {
    headers: {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NzUzN2ZmMTlmMzgxZGQ3YjY3ZWVlMWVhOGI4MTY0YSIsInN1YiI6IjVlM2ExNmU1MGMyNzEwMDAxODc1NTI4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nOpZ_nBtA93tbzr6-rxD0760tssAAaSppyjRv9anArs',
      'Accept': 'application/json',
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

addEventListener('fetch', event => {
  if (event.request.method === 'OPTIONS') {
    return event.respondWith(handleOptions(event.request));
  }
  
  event.respondWith(handleRequest(event.request));
});

function handleOptions(request) {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}