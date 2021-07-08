/**
 * Main
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Response With KV Value
 * 
 * @param {Request} _request Request
 */
async function handleRequest(_request) {
  const content = await kv.get("test");  // 変数 `kv` は Cloudflare Workers によって KV の名前空間名 `kv` がそのまま変数名に使われて自動的に定義されている
  return new Response(content, {
    headers: { 'content-type': 'application/json' }
  });
}
