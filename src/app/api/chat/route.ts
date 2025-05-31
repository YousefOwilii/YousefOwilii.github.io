import { NextRequest, NextResponse } from 'next/server';

// Use the same API key and model ID as in the ChatWidget component
const OPENROUTER_API_KEY = "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";
const OPENROUTER_MODEL_ID = "deepseek/deepseek-r1-0528:free";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    // Generate a random request ID
    const requestId = Math.random().toString(36).substring(2, 15);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yousefowili.me',
        'X-Title': 'AI Version of Yousef',
        'X-Request-ID': requestId
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL_ID,
        messages: messages,
        max_tokens: 300
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error: ${response.status}`, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` }, 
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
} 