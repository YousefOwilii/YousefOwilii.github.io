// Vercel serverless function backing the counter with Upstash Redis (Vercel Marketplace).
// Works once KV_REST_API_URL / KV_REST_API_TOKEN env vars exist on the project;
// until then it returns 501 and the app falls back to localStorage.
const KEY = 'job-race'
const PLAYERS = ['yousef', 'adham']

export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    return res.status(501).json({ error: 'storage not configured' })
  }
  const headers = { Authorization: `Bearer ${token}` }

  if (req.method === 'GET') {
    const r = await fetch(`${url}/hgetall/${KEY}`, { headers })
    const { result } = await r.json()
    // Upstash returns a flat [field, value, field, value] array
    const counts = { yousef: 0, adham: 0 }
    if (Array.isArray(result)) {
      for (let i = 0; i < result.length; i += 2) {
        if (PLAYERS.includes(result[i])) counts[result[i]] = Number(result[i + 1]) || 0
      }
    }
    return res.status(200).json(counts)
  }

  if (req.method === 'POST') {
    const { player, count } = req.body ?? {}
    if (!PLAYERS.includes(player) || !Number.isInteger(count) || count < 0 || count > 100000) {
      return res.status(400).json({ error: 'bad request' })
    }
    await fetch(`${url}/hset/${KEY}/${player}/${count}`, { headers })
    return res.status(200).json({ ok: true })
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'method not allowed' })
}
