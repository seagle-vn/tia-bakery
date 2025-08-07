const { createClient } = require('@supabase/supabase-js');

// Load environment variables  
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...');
    
    // Get all documents
    const { data, error, count } = await supabase
      .from('document_chunks')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('❌ Error:', error);
      return;
    }
    
    console.log(`📊 Total documents: ${count}`);
    
    if (data && data.length > 0) {
      data.forEach((doc, i) => {
        console.log(`\n📄 Document ${i + 1}:`);
        console.log(`ID: ${doc.id}`);
        console.log(`Content: ${doc.content.substring(0, 100)}...`);
        console.log(`Metadata:`, doc.metadata);
        console.log(`Embedding length: ${doc.embedding ? doc.embedding.length : 'NULL'}`);
      });
    }
    
    // Also test the match_documents function exists
    console.log('\n🔍 Testing match_documents function...');
    const testEmbedding = new Array(384).fill(0.001);
    
    const { data: matchData, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: testEmbedding,
      match_threshold: -1,
      match_count: 5
    });
    
    if (matchError) {
      console.error('❌ match_documents function error:', matchError);
    } else {
      console.log(`✅ match_documents function works, returned ${matchData?.length || 0} results`);
    }
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  }
}

checkDatabase();