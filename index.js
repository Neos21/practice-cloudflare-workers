/** KV のキー名 */
const keyName = 'note';

/**
 * エントリポイント
 */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * Handle Request
 * 
 * @param {Request} request Request
 * @return {Response} Response
 */
async function handleRequest(request) {
  if(request.method === 'PUT') {
    const note = await request.text();
    return updateNote(note);
  }
  return getNote();
}

/**
 * KV からノートを構成する JSON 文字列を取得しレスポンスする
 * 
 * @return {Response} Response
 */
async function getNote() {
  const note = await kv.get(keyName);  // 変数 `kv` は Cloudflare Workers によって KV の名前空間名 `kv` がそのまま変数名に使われて自動的に定義されている
  // KV にキーがなければ新規で値を書き込みその値をレスポンスして終了する
  if(note == null) return await updateNote(JSON.stringify({ text: 'First Note Created' }));
  return new Response(note, {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}

/**
 * KV にノートを構成する JSON 文字列を書き込みレスポンスする
 * 
 * @param {string} note ノートを構成する JSON 文字列
 * @return {Response} Response
 */
async function updateNote(note) {
  // JSON パース可能な文字列かどうか・`text` プロパティが存在するか確認する
  try {
    const parsed = JSON.parse(note);
    if(parsed.text == null) throw new Error('Failed To JSON Parse : The [text] Property Does Not Exist');
  }
  catch(error) {
    return new Response(error, { status: 500 });
  }
  await kv.put(keyName, note);
  return new Response(note, {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
