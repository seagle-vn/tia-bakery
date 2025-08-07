import axios from 'axios';

// Simple in-memory cache for common questions
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

export async function generateChatResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  // Create cache key from last user message
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const cacheKey = lastMessage.substring(0, 100); // First 100 chars
  
  // Check cache first
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('🎯 Using cached response');
    return cached.response;
  }

  try {
    // Clean up messages and ensure proper format
    const cleanMessages = messages.map(msg => ({
      role: msg.role,
      content: typeof msg.content === 'string' ? msg.content.trim() : String(msg.content).trim()
    })).filter(msg => msg.content.length > 0);

    console.log('🚀 Sending to Groq:', { 
      messageCount: cleanMessages.length,
      lastMessage: cleanMessages[cleanMessages.length - 1]?.content.substring(0, 100) + '...'
    });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: cleanMessages,
        max_tokens: 300,
        temperature: 0.3,
        top_p: 0.8,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const aiResponse = response.data.choices[0].message.content || 'I apologize, but I could not generate a response.';
    
    // Cache the response
    responseCache.set(cacheKey, {
      response: aiResponse,
      timestamp: Date.now()
    });
    
    return aiResponse;
  } catch (error) {
    console.error('Groq API error:', error);
    
    return "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or contact us directly at hello@tiabakery.com or (555) 123-BAKE for immediate assistance.";
  }
}

// Alternative function for streaming responses (if needed in the future)
export async function generateStreamingChatResponse(
  messages: Array<{ role: string; content: string }>
): Promise<ReadableStream> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      stream: true
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  return response.body as ReadableStream;
}