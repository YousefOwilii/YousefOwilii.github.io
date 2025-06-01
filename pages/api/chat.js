// Next.js API route for OpenRouter chat completions

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model } = req.body;
    
    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.referer || 'https://yourdomain.com',
        'X-Title': 'AI Version of Yousef'
      },
      body: JSON.stringify({
        model: model || "deepseek/deepseek-r1-0528:free",
        messages
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return res.status(response.status).json({ 
        error: `OpenRouter API error: ${response.status}`,
        details: errorData 
      });
    }
    
    const data = await response.json();
    
    // Extract and return just the response content
    return res.status(200).json({ 
      response: data.choices[0]?.message?.content || "Sorry, I couldn't process that request."
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
} 