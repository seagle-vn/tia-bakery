const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function showCacheStats() {
  try {
    console.log('📊 Query Cache Performance Report');
    console.log('=' .repeat(50));

    // Get overall stats
    const { data: stats } = await supabase.rpc('get_cache_stats');
    const stat = stats?.[0];

    if (stat) {
      console.log(`\n🔢 OVERALL STATISTICS:`);
      console.log(`   Total Cached Queries: ${stat.total_queries || 0}`);
      console.log(`   Total Cache Usage: ${stat.total_usage || 0}`);
      console.log(`   Average Usage per Query: ${parseFloat(stat.avg_usage || 0).toFixed(2)}`);
      console.log(`   Tokens Saved: ${stat.tokens_saved || 0}`);
      console.log(`   API Calls Saved: ${stat.api_calls_saved || 0}`);
      console.log(`   Cache Hit Rate: ${parseFloat(stat.cache_hit_potential || 0).toFixed(2)}%`);
    }

    // Get top queries by usage
    const { data: topQueries } = await supabase
      .from('cached_queries')
      .select('question, usage_count, intent, confidence, last_used_at')
      .order('usage_count', { ascending: false })
      .limit(10);

    if (topQueries && topQueries.length > 0) {
      console.log(`\n🏆 TOP CACHED QUERIES:`);
      topQueries.forEach((query, index) => {
        const lastUsed = new Date(query.last_used_at).toLocaleDateString();
        console.log(`   ${index + 1}. "${query.question}" (${query.usage_count} uses, ${query.intent}, last used: ${lastUsed})`);
      });
    }

    // Get queries by intent
    const { data: byIntent } = await supabase
      .from('cached_queries')
      .select('intent, count(*)')
      .group('intent');

    if (byIntent && byIntent.length > 0) {
      console.log(`\n🎯 QUERIES BY INTENT:`);
      byIntent
        .sort((a, b) => b.count - a.count)
        .forEach(intent => {
          console.log(`   ${intent.intent || 'general'}: ${intent.count} queries`);
        });
    }

    // Get recent activity
    const { data: recent } = await supabase
      .from('cached_queries')
      .select('question, created_at, usage_count')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recent && recent.length > 0) {
      console.log(`\n📅 RECENT CACHE ADDITIONS:`);
      recent.forEach(query => {
        const created = new Date(query.created_at).toLocaleString();
        console.log(`   "${query.question}" (${query.usage_count} uses, added: ${created})`);
      });
    }

    console.log('\n' + '=' .repeat(50));

  } catch (error) {
    console.error('❌ Error fetching cache stats:', error);
  }
}

async function cleanupCache() {
  try {
    console.log('🧹 Cleaning up old cache entries...');
    
    const { data: deletedCount } = await supabase.rpc('cleanup_query_cache', {
      min_usage_threshold: 2,
      max_age_days: 30,
      keep_pinned: true
    });

    console.log(`✅ Cleaned up ${deletedCount || 0} cache entries`);
    
  } catch (error) {
    console.error('❌ Error cleaning cache:', error);
  }
}

// Command line interface
const command = process.argv[2];

if (command === 'stats') {
  showCacheStats();
} else if (command === 'cleanup') {
  cleanupCache();
} else {
  console.log('Usage:');
  console.log('  node scripts/cache-stats.js stats    - Show cache performance statistics');
  console.log('  node scripts/cache-stats.js cleanup  - Clean up old cache entries');
}

module.exports = { showCacheStats, cleanupCache };