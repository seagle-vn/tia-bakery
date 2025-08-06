const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env' });

// Debug: Check if API key is loaded
console.log('🔍 Checking environment variables...');
console.log('HUGGING_FACE_TOKEN:', process.env.HUGGINGFACE_API_KEY ? 'Found' : 'Missing');
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Found' : 'Missing');
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Missing');

if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('❌ HUGGING_FACE_TOKEN not found in .env');
  process.exit(1);
}

if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY not found in .env');
  process.exit(1);
}

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { 
    auth: { persistSession: false }, 
    realtime: { disabled: true } 
  }
);

const BUSINESS_DOCUMENTS = `
COMPANY NAME: Tia Bakery

ABOUT US:
Welcome to Tia Bakery! We're a family-owned bakery specializing in fresh, artisanal breads, pastries, and custom cakes. Established in 2020, we pride ourselves on using only the finest ingredients and traditional baking methods.

SERVICES:
Fresh Bread: Daily baked sourdough, whole wheat, rye, and specialty breads
Pastries: Croissants, danishes, muffins, and seasonal treats  
Custom Cakes: Wedding cakes, birthday cakes, and special occasion desserts
Catering: Office breakfast platters, party dessert tables
Coffee & Beverages: Freshly brewed coffee, tea, and specialty drinks

PRICING:
Bread: $4-8 per loaf
Pastries: $2-6 each
Custom Cakes: Starting at $30 (price varies by size and design)
Coffee: $2-5
Catering: Contact for custom quotes

CONTACT INFORMATION:
Email: hello@tiabakery.com
Phone: (555) 123-BAKE
Address: 123 Baker Street, Sweet Town, ST 12345
Business Hours: 
- Monday-Friday: 6AM-7PM
- Saturday: 7AM-8PM  
- Sunday: 8AM-5PM
Website: www.tiabakery.com

POLICIES:
Return Policy: Fresh items can be returned within 24 hours with receipt
Custom Orders: Require 48-72 hours advance notice
Payment: We accept cash, credit cards, and mobile payments
Allergies: Please inform us of any allergies - we work with nuts, dairy, and gluten

FREQUENTLY ASKED QUESTIONS:
Q: Do you take custom cake orders?
A: Yes! We specialize in custom cakes for all occasions. Please call or visit us to discuss your needs.

Q: What time do you open?
A: We open at 6AM Monday-Friday, 7AM Saturday, and 8AM Sunday.

Q: Do you have gluten-free options?
A: Yes, we offer a selection of gluten-free breads and pastries. Please ask our staff for current options.

Q: Do you deliver?
A: We offer local delivery for orders over $25. Delivery fees apply.

Q: Can I place orders online?
A: Currently we take orders by phone or in-person. Online ordering coming soon!
`;

// Generate embedding using Hugging Face API for documents
async function generateEmbedding(text) {
  try {
    console.log('🔄 Generating document embedding with intfloat/e5-base-v2...');
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/intfloat/e5-base-v2',
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
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
    return createImprovedEmbedding(text);
  }
}

// Improved embedding with bakery-specific terms
function createImprovedEmbedding(text, dimensions = 1536) {
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
    'tia': 5, 'specializes': 3, 'vanilla': 2, 'chocolate': 2
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

// Create a simple embedding from text using basic mathematical approach
function createSimpleEmbedding(text, dimensions = 384) {
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


function splitTextIntoChunks(text, chunkSize = 800) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const chunks = [];
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

  return chunks.filter(chunk => chunk.length > 50);
}

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection with a simple select
    const { data, error, count } = await supabase
      .from('document_chunks')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
    
    console.log('✅ Supabase connection working');
    console.log('📊 Current document count:', count || 0);
    return true;
  } catch (error) {
    console.error('❌ Supabase test failed:', error);
    return false;
  }
}

async function uploadDocuments() {
  try {
    // Test Supabase connection first
    const supabaseWorking = await testSupabaseConnection();
    if (!supabaseWorking) {
      throw new Error('Supabase connection failed');
    }

    console.log('🚀 Starting document upload process...');
    
    const chunks = splitTextIntoChunks(BUSINESS_DOCUMENTS, 600);
    console.log(`📄 Created ${chunks.length} document chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`⚡ Processing chunk ${i + 1}/${chunks.length}...`);
      console.log(`📝 Chunk preview: ${chunk.substring(0, 100)}...`);
      
      const embedding = await generateEmbedding(chunk);
      
      console.log(`📊 Generated embedding of length: ${embedding.length}`);
      
      // Prepare the data to insert
      const insertData = {
        content: chunk,
        embedding: embedding,
        metadata: {
          chunk_index: i,
          document_name: 'business_info',
          upload_date: new Date().toISOString(),
          word_count: chunk.split(' ').length
        }
      };
      
      console.log('📤 Inserting chunk data...');
      console.log('📝 Content length:', chunk.length);
      console.log('🔢 Embedding length:', embedding.length);
      console.log('📋 Metadata:', JSON.stringify(insertData.metadata, null, 2));
      
      const { data, error } = await supabase
        .from('document_chunks')
        .insert(insertData)
        .select();

      if (error) {
        console.error('❌ Error uploading chunk:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error.details);
        console.error('❌ Error hint:', error.hint);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('✅ Insert successful, returned data:', data);
      
      
      console.log(`✅ Successfully uploaded chunk ${i + 1}`);
      
      // Add delay to respect rate limits
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('✅ Document upload completed successfully!');
    console.log('🎉 Your chatbot is ready to answer questions!');
  } catch (error) {
    console.error('❌ Upload failed:', error);
    console.error('Full error details:', error);
    process.exit(1);
  }
}

uploadDocuments();