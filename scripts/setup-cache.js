const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupCache() {
  try {
    console.log('🚀 Setting up query cache system...');
    console.log('');
    console.log('⚠️  MANUAL SETUP REQUIRED:');
    console.log('Since Supabase doesn\'t allow executing arbitrary SQL from the client,');
    console.log('you need to run the SQL schema manually in your Supabase dashboard.');
    console.log('');
    console.log('📋 STEPS:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of scripts/create-cache-table.sql');
    console.log('4. Execute the SQL to create the cache table and functions');
    console.log('5. Run this script again to verify and warm the cache');
    console.log('');

    // Check if table already exists
    const { data, error } = await supabase
      .from('cached_queries')
      .select('id', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.log('❌ Cache table not found. Please execute the SQL schema first.');
        console.log('');
        console.log('🔗 Quick setup:');
        console.log('   1. Open: https://supabase.com/dashboard/projects');
        console.log('   2. Select your project → SQL Editor');  
        console.log('   3. Paste contents from: scripts/create-cache-table.sql');
        console.log('   4. Click "Run" to execute');
        console.log('');
        return;
      }
      console.error('❌ Verification failed:', error);
      return;
    }

    console.log('✅ Cache table verified successfully');
    
    // Get current count
    const { count } = await supabase
      .from('cached_queries')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Current cache entries: ${count || 0}`);

    // Test that functions work
    try {
      const { data: statsData, error: statsError } = await supabase.rpc('get_cache_stats');
      if (statsError) {
        console.log('⚠️  Cache functions may not be created yet. Please check the SQL execution.');
        console.log('Error:', statsError.message);
      } else {
        console.log('✅ Cache functions verified');
      }
    } catch (err) {
      console.log('⚠️  Could not verify cache functions:', err.message);
    }

    // Pre-warm cache with common questions
    await warmCache();

    console.log('🎉 Cache setup completed!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

async function warmCache() {
  console.log('🔥 Pre-warming cache with common questions...');
  
  const commonQuestions = [
    {
      question: "What are your business hours?",
      answer: "We're open Monday-Friday: 6AM-7PM, Saturday: 7AM-8PM, and Sunday: 8AM-5PM. We'd love to see you soon! 😊",
      intent: "hours"
    },
    {
      question: "Do you deliver?",
      answer: "Yes! We offer local delivery for orders over $25. Delivery fees apply. You can call us at (555) 123-BAKE to place your order! 🚚",
      intent: "delivery"
    },
    {
      question: "What's your return policy?",
      answer: "Fresh items can be returned within 24 hours with receipt. We want you to be completely satisfied with your purchase! 🛍️",
      intent: "policies"
    },
    {
      question: "Do you have gluten-free options?",
      answer: "Yes, we offer a selection of gluten-free breads and pastries. Please ask our staff for current options when you visit! 🍞",
      intent: "allergies"
    },
    {
      question: "How much do custom cakes cost?",
      answer: "Custom cakes start at $30, with pricing varying by size and design. We require 48-72 hours advance notice. Call us to discuss your special cake! 🎂",
      intent: "pricing"
    },
    {
      question: "What's your phone number?",
      answer: "You can reach us at (555) 123-BAKE. We'd love to hear from you! 📞",
      intent: "contact"
    },
    {
      question: "Where are you located?",
      answer: "We're located at 123 Baker Street, Sweet Town, ST 12345. Come visit us! 📍",
      intent: "location"
    }
  ];

  try {
    // Simple cache warming without using the cache class
    for (const item of commonQuestions) {
      // Create a simple hash for the question
      const crypto = require('crypto');
      const questionHash = crypto.createHash('sha256')
        .update(item.question.toLowerCase().trim().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' '))
        .digest('hex');

      // Check if already exists
      const { data: existing } = await supabase
        .from('cached_queries')
        .select('id')
        .eq('question_hash', questionHash)
        .single();

      if (!existing) {
        // Insert the cache entry
        const { error } = await supabase
          .from('cached_queries')
          .insert({
            question: item.question,
            question_hash: questionHash,
            question_normalized: item.question.toLowerCase().trim(),
            embedding: new Array(384).fill(0.1), // Placeholder embedding
            answer: item.answer,
            intent: item.intent,
            confidence: 0.9,
            is_pinned: true // Pin common questions
          });

        if (error) {
          console.log(`⚠️  Could not cache "${item.question}":`, error.message);
        } else {
          console.log(`✅ Cached: "${item.question}"`);
        }
      } else {
        console.log(`📌 Already cached: "${item.question}"`);
      }
    }
    
    console.log('✅ Cache pre-warming completed');
  } catch (error) {
    console.log('⚠️  Cache warming failed:', error.message);
    console.log('💡 You can warm the cache later by asking these questions through the chat interface.');
  }
}

// Run setup if called directly
if (require.main === module) {
  setupCache();
}

module.exports = { setupCache, warmCache };