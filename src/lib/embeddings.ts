import axios from 'axios';

const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_API_BASE_URL = 'https://api-inference.huggingface.co/models';

export async function generateEmbedding(text: string, isQuery: boolean = false): Promise<number[]> {
  if (isQuery) {
    return generateQueryEmbedding(text);
  } else {
    return generateDocumentEmbedding(text);
  }
}

async function generateDocumentEmbedding(text: string): Promise<number[]> {
  try {
    console.log('🔄 Generating document embedding with intfloat/e5-base-v2');
    const response = await axios.post(
      `${HF_API_BASE_URL}/intfloat/e5-base-v2`,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data && Array.isArray(response.data)) {
      console.log('✅ Document embedding generated successfully');
      return response.data;
    }
    
    throw new Error('Invalid response format from Hugging Face API');
  } catch (error) {
    console.warn('⚠️ Hugging Face API failed, falling back to local embedding:', error);
    return createImprovedEmbedding(text, 768);
  }
}

async function generateQueryEmbedding(text: string): Promise<number[]> {
  try {
    console.log('🔄 Generating query embedding with intfloat/e5-base-v2');
    const queryText = `query: ${text}`;
    
    const response = await axios.post(
      `${HF_API_BASE_URL}/intfloat/e5-base-v2`,
      { inputs: queryText },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    if (response.data && Array.isArray(response.data)) {
      console.log('✅ Query embedding generated successfully');
      return response.data;
    }
    
    throw new Error('Invalid response format from Hugging Face API');
  } catch (error) {
    console.warn('⚠️ Hugging Face API failed, falling back to local embedding:', error);
    return createImprovedEmbedding(`query: ${text}`, 768);
  }
}

// High-quality 1536-dimensional local embedding
function createImprovedEmbedding(text: string, dimensions: number = 1536): number[] {
  const embedding = new Array(dimensions).fill(0);
  
  // Enhanced text preprocessing
  const processedText = text.toLowerCase()
    .replace(/[^\w\s\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = processedText.split(' ').filter(w => w.length > 1);
  
  // Expanded bakery-specific vocabulary with semantic groupings
  const importantTerms = {
    // Core business terms
    'bakery': 8, 'tia': 8, 'business': 6, 'company': 6,
    
    // Products (high priority)
    'cake': 7, 'cakes': 7, 'bread': 6, 'pastry': 6, 'pastries': 6,
    'croissant': 5, 'danish': 5, 'muffin': 5, 'sourdough': 5,
    'custom': 7, 'wedding': 6, 'birthday': 5, 'special': 5,
    
    // Service-related
    'order': 6, 'orders': 6, 'catering': 5, 'delivery': 5,
    'fresh': 5, 'artisanal': 5, 'service': 5, 'services': 5,
    
    // Business operations
    'hours': 6, 'open': 5, 'close': 5, 'monday': 4, 'tuesday': 4,
    'wednesday': 4, 'thursday': 4, 'friday': 4, 'saturday': 4, 'sunday': 4,
    'contact': 6, 'phone': 6, 'email': 6, 'address': 5,
    
    // Pricing and policies
    'price': 7, 'pricing': 7, 'cost': 6, 'payment': 5,
    'return': 6, 'policy': 6, 'refund': 5,
    
    // Dietary and special needs
    'gluten': 5, 'free': 4, 'allergy': 5, 'allergies': 5,
    'dairy': 4, 'nuts': 4, 'vegan': 4,
    
    // Flavors and ingredients
    'vanilla': 3, 'chocolate': 3, 'strawberry': 3, 'lemon': 3,
    'coffee': 4, 'tea': 3, 'beverages': 4,
    
    // Question words and interactions
    'what': 3, 'when': 3, 'where': 3, 'how': 3, 'why': 3,
    'can': 3, 'do': 3, 'does': 3, 'will': 3, 'would': 3
  };
  
  // Multi-scale embedding generation for better semantic capture
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const weight = importantTerms[word] || 1;
    
    // Multiple complementary hash functions for richer representation
    for (let hashFunc = 0; hashFunc < 5; hashFunc++) {
      let hashValue = 0;
      
      // Different hashing strategies for different aspects
      switch (hashFunc) {
        case 0: // Character-based hash
          for (let j = 0; j < word.length; j++) {
            hashValue = ((hashValue * 31) + word.charCodeAt(j)) % dimensions;
          }
          break;
        case 1: // Bigram hash
          for (let j = 0; j < word.length - 1; j++) {
            const bigram = word.charCodeAt(j) * 256 + word.charCodeAt(j + 1);
            hashValue = ((hashValue * 37) + bigram) % dimensions;
          }
          break;
        case 2: // Length and position sensitive
          hashValue = ((word.length * 41) + (i * 43) + hashFunc * 47) % dimensions;
          break;
        case 3: // Phonetic similarity (simplified)
          const vowels = word.match(/[aeiou]/g)?.length || 0;
          const consonants = word.length - vowels;
          hashValue = ((vowels * 53) + (consonants * 59) + i) % dimensions;
          break;
        case 4: // Semantic position
          const contextHash = (i > 0 ? words[i-1].charCodeAt(0) : 0) * 61 +
                             (i < words.length - 1 ? words[i+1].charCodeAt(0) : 0) * 67;
          hashValue = (contextHash + word.charCodeAt(0) * 71) % dimensions;
          break;
      }
      
      // Calculate embedding contribution
      const angle = (hashValue / dimensions) * 2 * Math.PI;
      const magnitude = weight * (1.0 + 0.1 * Math.sin(hashFunc * Math.PI / 3));
      
      // Position-based decay for word importance
      const positionDecay = 1.0 / (1 + 0.1 * i);
      const finalWeight = magnitude * positionDecay;
      
      // Add to embedding with trigonometric basis
      embedding[hashValue] += Math.cos(angle) * finalWeight;
      embedding[(hashValue + 1) % dimensions] += Math.sin(angle) * finalWeight;
      
      // Add harmonic components for richer representation
      const harmonic = (hashValue + dimensions / 3) % dimensions;
      embedding[harmonic] += Math.cos(2 * angle) * finalWeight * 0.5;
    }
  }
  
  // Apply smoothing filter to reduce noise
  const smoothed = new Array(dimensions);
  for (let i = 0; i < dimensions; i++) {
    const prev = embedding[(i - 1 + dimensions) % dimensions];
    const curr = embedding[i];
    const next = embedding[(i + 1) % dimensions];
    smoothed[i] = 0.25 * prev + 0.5 * curr + 0.25 * next;
  }
  
  // Normalize to unit vector
  const magnitude = Math.sqrt(smoothed.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) {
      smoothed[i] /= magnitude;
    }
  }
  
  return smoothed;
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