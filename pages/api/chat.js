// Next.js API route for OpenRouter chat completions

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Ideally, restrict this to your specific domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Origin');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("API request received");
    const { messages, model } = req.body;
    
    // Get API key - use a valid key that works
    // Based on error logs, the previous key might be invalid or expired
    const apiKey = "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";
    
    console.log("Calling OpenRouter API");
    
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || req.headers.referer || 'https://yousef-owilii-github-io.vercel.app',
        'X-Title': 'AI Version of Yousef'
      },
      body: JSON.stringify({
        model: model || "deepseek/deepseek-r1-0528:free",
        messages
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      
      // Return a more detailed error response
      return res.status(500).json({ 
        error: `OpenRouter API error: ${response.status}`,
        details: errorData,
        message: "The API key might be invalid or expired"
      });
    }
    
    const data = await response.json();
    console.log("OpenRouter API response received");
    
    // Extract and return just the response content
    return res.status(200).json({ 
      response: data.choices[0]?.message?.content || "Sorry, I couldn't process that request."
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
} 