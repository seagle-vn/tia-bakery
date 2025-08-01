import axios from 'axios';

export async function generateChatResponse(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response generated from Groq');
    }

    return aiResponse.trim();
  } catch (error) {
    console.error('Groq API error:', error);
    
    // Fallback response for different scenarios
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        return "I'm experiencing high demand right now. Please try again in a moment, or feel free to contact us directly for immediate assistance.";
      } else if (error.response?.status === 401) {
        return "I'm having authentication issues at the moment. Please contact us directly for assistance.";
      }
    }
    
    return "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or contact us directly for immediate assistance.";
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