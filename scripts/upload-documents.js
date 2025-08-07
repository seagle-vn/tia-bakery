const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env' });

// Debug: Check if API key is loaded
console.log('🔍 Checking environment variables...');
console.log(
  'HUGGING_FACE_TOKEN:',
  process.env.HUGGINGFACE_API_KEY ? 'Found' : 'Missing'
);
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Found' : 'Missing');
console.log(
  'SUPABASE_URL:',
  process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing'
);
console.log(
  'SUPABASE_KEY:',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Missing'
);

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
    realtime: { disabled: true },
  }
);

const BUSINESS_DOCUMENTS = `
About TIA Bakery
Location: London, Ontario, Canada
Business Type: Custom cake designer and bakery specializing in personalized cakes for special occasions

Custom cake design and creation
Bento cakes (specialty focus)
Special occasion cakes (birthdays, weddings, celebrations)
Personalized cake artistry

Contact Information & Online Presence
Phone: 226-700-3943 (Primary contact for orders and design submissions)
Website: www.tiabakery.ca
Social Media:

Instagram: @tiabakery2019

2,473 followers, 344 posts
Bio: "📍 Custom Cake in London Ontario 🚚 Delivery or Pickup available 💌 DM to Place Your Order!"


Facebook: "Tia Bakery" page

170 likes, 162 check-ins
Description: "I make custom cakes for your special occasions"

Contact Methods:

Phone/Text: 226-700-3943 (easiest way to place orders)
Email: tiadang2021@gmail.com

Services Offered

Custom Cake Design: Personalized cakes with custom flavors, fillings, design themes, colors, and decorations
Bento Cakes: Specialized small, customized cakes
Design Consultation: Accepts reference images to understand customer vision
Delivery Service: Available within London, Ontario and surrounding areas
Pickup Service: Available from bakery location

Frequently Asked Questions (FAQ)
📋 Ordering & Customization
Q: How far in advance should I place my order?
A: We recommend placing your order at least 3-5 days in advance to allow time for design and preparation. For larger or more complex orders, booking 2-3 weeks ahead is ideal.
Q: Do you offer cake tastings?
A: I do not offer cake tastings. Instead, I focus on creating exceptional bento cakes customized to your specific flavour preferences.
Q: Can I customize my cake?
A: Absolutely! I specialize in custom cakes. You can choose flavors, fillings, design themes, colors, and decorations. You can also send reference images to help me understand your vision.
Q: How do I submit my design ideas?
A: For the easiest way to place an order, you can email me or text me through the phone number: 226-700-3943
💰 Pricing & Payment
Q: How much do custom cakes cost?
A: Pricing varies depending on the size, complexity, and level of detail. For a detailed quote, please contact me with your specifications.
Q: Do you require a deposit?
A: To secure your order (for orders over $100), a deposit is required. The full payment is due upon pickup or delivery of the cake.
Q: What payment methods do you accept?
A: We accept cash, PayPal, Wise and e-transfer.
Q: Are there any extra fees for rush orders?
A: Yes, rush orders may incur an additional fee. Please contact me as soon as possible if you need a cake on short notice, and I'll do our best to accommodate.
🚚 Pick-up & Delivery
Q: Do you offer delivery?
A: Yes, we offer delivery within London, Ontario and surrounding areas. Delivery fees vary based on distance from our bakery. You can also choose to pick up your order from our location.
Q: Can you ship cakes outside of London, Ontario?
A: Currently, we only deliver within London, Ontario, and its surrounding areas. Shipping cakes long distances can affect quality, so we limit our delivery range to maintain freshness.
🔄 Return & Refund
Q: Are refunds or exchanges allowed for custom cakes?
A: No. All our cakes are made-to-order and personalized, so all sales are final. We do not offer refunds or exchanges once an order is picked up or delivered.
Q: What if I'm not satisfied with the taste or design?
A: Your satisfaction is our priority! If you have any concerns, please contact us immediately, and we'll work to resolve the issue.
Key Policies & Information
Order Timeline:

Standard orders: 3-5 days advance notice
Complex orders: 2-3 weeks advance notice

Payment Structure:

Deposit required for orders over $100
Full payment due at pickup/delivery
Accepted methods: Cash, PayPal, Wise, e-transfer

Service Area: London, Ontario and surrounding areas only
No Tastings Policy: Focus on customized bento cakes based on flavor preferences
All Sales Final: No refunds or exchanges for custom orders


How to Order

Contact: Call/text 226-700-3943 or email tiadang2021@gmail.com
Discuss: Share your design ideas, reference images, and specifications
Quote: Receive custom pricing based on complexity and size
Deposit: Pay deposit for orders over $100 to secure booking
Timeline: Allow 3-5 days minimum (2-3 weeks for complex orders)
Delivery/Pickup: Choose delivery (within service area) or pickup
Final Payment: Complete payment upon delivery/pickup


Note: This information is current as of August 2025. For the most up-to-date pricing and availability, contact TIA Bakery directly at 226-700-3943.
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
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.data && Array.isArray(response.data)) {
      console.log('✅ Document embedding generated successfully');
      return response.data;
    }

    throw new Error('Invalid response format from Hugging Face API');
  } catch (error) {
    console.warn(
      '⚠️ Hugging Face API failed, falling back to local embedding:',
      error
    );
    return createImprovedEmbedding(text);
  }
}

// Improved embedding with bakery-specific terms
function createImprovedEmbedding(text, dimensions = 1536) {
  const embedding = new Array(dimensions).fill(0);

  // Preprocess text
  const processedText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = processedText.split(' ').filter((w) => w.length > 2);

  // Bakery-specific important terms with higher weights
  const importantTerms = {
    bakery: 5,
    cake: 5,
    bread: 4,
    pastry: 4,
    custom: 4,
    order: 4,
    delivery: 3,
    fresh: 3,
    artisanal: 3,
    wedding: 4,
    birthday: 3,
    catering: 3,
    coffee: 3,
    hours: 4,
    contact: 4,
    phone: 4,
    email: 4,
    price: 4,
    cost: 4,
    gluten: 3,
    free: 3,
    tia: 5,
    specializes: 3,
    vanilla: 2,
    chocolate: 2,
  };

  // Create embedding with weighted terms
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const weight = importantTerms[word] || 1;

    // Use multiple hash functions for better distribution
    for (let hash = 0; hash < 3; hash++) {
      let hashValue = 0;
      for (let j = 0; j < word.length; j++) {
        hashValue =
          (hashValue * 31 + word.charCodeAt(j) + hash * 17) % dimensions;
      }

      const value = Math.sin((hashValue / dimensions) * Math.PI) * weight;
      embedding[hashValue] += value;

      // Add position and context information
      const positionWeight = 1 / Math.log(i + 2);
      embedding[(hashValue + i) % dimensions] += value * positionWeight;
    }
  }

  // Normalize
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
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
  const magnitude = Math.sqrt(
    embedding.reduce((sum, val) => sum + val * val, 0)
  );
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}

function splitTextIntoChunks(text, chunkSize = 800) {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (
      (currentChunk + trimmedSentence).length > chunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = trimmedSentence;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 50);
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
          word_count: chunk.split(' ').length,
        },
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
      await new Promise((resolve) => setTimeout(resolve, 3000));
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
