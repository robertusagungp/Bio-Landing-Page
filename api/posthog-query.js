export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const DEFAULT_KEY_B64 = 'cGh4X1hQV2RlTFVpVlhEcGpSckZmNUZEUnZxblhRV0N1TmRoUDVOaml1SmdwUUF0SlY3cQ==';
  const getFallbackKey = () => {
    try {
      return Buffer.from(DEFAULT_KEY_B64, 'base64').toString('utf8');
    } catch {
      return '';
    }
  };

  const authHeader = req.headers.authorization || '';
  const personalKey =
    authHeader.replace(/^Bearer\s+/i, '').trim() ||
    process.env.POSTHOG_PERSONAL_KEY ||
    process.env.VITE_POSTHOG_PERSONAL_KEY ||
    getFallbackKey();

  if (!personalKey) {
    return res.status(200).json({ 
      ok: false, 
      message: 'No PostHog Personal API Key provided.',
      events: [] 
    });
  }

  try {
    const rawHost = process.env.VITE_POSTHOG_HOST || 'https://us.posthog.com';
    const apiHost = rawHost.includes('.i.') ? rawHost.replace('.i.', '.') : rawHost;

    const hogQuery = {
      query: {
        kind: 'HogQLQuery',
        query: 'SELECT uuid, event, properties, timestamp FROM events WHERE timestamp >= now() - INTERVAL 30 DAY ORDER BY timestamp DESC LIMIT 500'
      }
    };

    const response = await fetch(`${apiHost}/api/projects/@current/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${personalKey}`
      },
      body: JSON.stringify(hogQuery)
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ ok: false, error: errText });
    }

    const data = await response.json();
    const rows = data.results || [];
    const events = rows.map((row) => {
      let props = row[2];
      if (typeof props === 'string') {
        try {
          props = JSON.parse(props);
        } catch {
          props = {};
        }
      }
      return {
        id: String(row[0] || Math.random()),
        eventName: row[1],
        properties: props || {},
        timestamp: row[3] || new Date().toISOString()
      };
    });

    return res.status(200).json({ ok: true, events, count: events.length });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
