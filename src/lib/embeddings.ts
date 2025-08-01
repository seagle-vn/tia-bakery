import axios from 'axios';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use Groq to process and extract key features from text
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `Extract the key semantic features and concepts from this text for embedding purposes. Respond with a comma-separated list of important keywords and concepts: ${text.substring(0, 1000)}`
        }],
        max_tokens: 200,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const keywords = response.data.choices[0].message.content;
    
    // Create a simple embedding from the text + keywords
    const combinedText = text + ' ' + keywords;
    const embedding = createSimpleEmbedding(combinedText);
    
    return embedding;
  } catch (error) {
    console.error('Groq embedding generation failed:', error);
    // Fallback to simple embedding without Groq processing
    return createSimpleEmbedding(text);
  }
}

// Create a simple embedding from text using basic mathematical approach
function createSimpleEmbedding(text: string, dimensions: number = 384): number[] {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const embedding = new Array(dimensions).fill(0);
  
  // Create embedding based on word positions, lengths, and character codes
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const charCode = word.charCodeAt(j);
      const index = (charCode + i + j) % dimensions;
      embedding[index] += Math.sin(charCode / 127) * Math.cos(i / words.length);
    }
  }
  
  // Normalize the embedding vector
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

export function splitTextIntoChunks(text: string, chunkSize: number = 800): string[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if ((currentChunk + trimmedSentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 50); // Filter out very short chunks
} 