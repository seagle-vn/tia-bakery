const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Load environment variables
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Same embedding function as in the app - using E5 for queries
async function generateEmbedding(text) {
  try {
    console.log('🔄 Generating query embedding with intfloat/e5-base-v2');
    const queryText = `query: ${text}`;
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/intfloat/e5-base-v2',
      { inputs: queryText },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
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

function createImprovedEmbedding(text, dimensions = 768) {
  const embedding = new Array(dimensions).fill(0);
  
  // Preprocess text
  const processedText = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const words = processedText.split(' ').filter(w => w.length > 2);
  
  // Bakery-specific important terms with higher weights
  const importantTerms = {
    'bakery': 5, 'cake': 5, 'bread': 4, 'pastry': 4, 'custom': 4,
    'order': 4, 'delivery': 3, 'fresh': 3, 'artisanal': 3,
    'wedding': 4, 'birthday': 3, 'catering': 3, 'coffee': 3,
    'hours': 4, 'contact': 4, 'phone': 4, 'email': 4,
    'price': 4, 'cost': 4, 'gluten': 3, 'free': 3,
    'tia': 5, 'specializes': 3, 'vanilla': 2, 'chocolate': 2,
    'return': 4, 'policy': 4, 'pricing': 5
  };
  
  // Create embedding with weighted terms
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const weight = importantTerms[word] || 1;
    
    // Use multiple hash functions for better distribution
    for (let hash = 0; hash < 3; hash++) {
      let hashValue = 0;
      for (let j = 0; j < word.length; j++) {
        hashValue = ((hashValue * 31) + word.charCodeAt(j) + hash * 17) % dimensions;
      }
      
      const value = Math.sin(hashValue / dimensions * Math.PI) * weight;
      embedding[hashValue] += value;
      
      // Add position and context information
      const positionWeight = 1 / Math.log(i + 2);
      embedding[(hashValue + i) % dimensions] += value * positionWeight;
    }
  }
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }
  
  return embedding;
}

async function searchDocuments(queryEmbedding, matchThreshold = 0.3, matchCount = 5) {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: matchThreshold,
    match_count: matchCount
  });

  if (error) {
    console.error('Supabase search error:', error);
    throw error;
  }

  return data || [];
}

async function testSearch() {
  try {
    console.log('🔍 Testing document search...');
    
    // Test different queries
    const queries = [
      "what's your pricing?",
      "return policy",
      "what are your services?",
      "business hours"
    ];
    
    for (const query of queries) {
      console.log(`\n🔍 Testing query: "${query}"`);
      
      const embedding = await generateEmbedding(query);
      console.log(`📊 Generated embedding of length: ${embedding.length}`);
      
      // Test with very low threshold to see if documents exist
      const documents = await searchDocuments(embedding, -1, 5);
      console.log(`📚 Found ${documents.length} documents`);
      
      if (documents.length > 0) {
        documents.forEach((doc, i) => {
          console.log(`\n📄 Document ${i + 1} (similarity: ${doc.similarity?.toFixed(3)}):`);
          console.log(doc.content.substring(0, 200) + '...');
        });
      } else {
        console.log('❌ No documents found!');
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSearch();