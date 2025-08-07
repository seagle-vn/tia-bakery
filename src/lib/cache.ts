import crypto from 'crypto';
import { supabase } from './supabase';
import { generateEmbedding } from './embeddings';

export interface CacheEntry {
  id: string;
  question: string;
  answer: string;
  similarity?: number;
  usage_count: number;
  confidence: number;
  intent: string;
  context_sources: string[];
}

export interface CacheConfig {
  exactMatchThreshold: number; // 0.98+ for near-identical questions
  semanticMatchThreshold: number; // 0.85+ for semantically similar
  useSemanticCache: boolean; // Whether to use semantic similarity for cache hits
  maxCacheAge: number; // hours
  enableAutoCleanup: boolean;
}

export const defaultCacheConfig: CacheConfig = {
  exactMatchThreshold: 0.98,
  semanticMatchThreshold: 0.85,
  useSemanticCache: true,
  maxCacheAge: 24 * 7, // 1 week
  enableAutoCleanup: true
};

export class QueryCache {
  private config: CacheConfig;

  constructor(config: CacheConfig = defaultCacheConfig) {
    this.config = config;
  }

  /**
   * Normalize question for better matching
   */
  private normalizeQuestion(question: string): string {
    return question
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Generate hash for exact matching
   */
  private hashQuestion(question: string): string {
    const normalized = this.normalizeQuestion(question);
    return crypto.createHash('sha256').update(normalized).digest('hex');
  }

  /**
   * Classify question intent for better organization
   */
  private classifyIntent(question: string): string {
    const intents = {
      pricing: /price|cost|how much|expensive|cheap|pricing|rates|fees/i,
      hours: /hours|open|close|when|time|schedule/i,
      policies: /policy|return|refund|exchange|guarantee/i,
      menu: /menu|options|have|sell|offer|available|selection/i,
      delivery: /deliver|pickup|order|shipping|takeout/i,
      custom: /custom|special|wedding|birthday|cake|personalized/i,
      location: /where|address|location|directions/i,
      contact: /contact|phone|email|reach|call/i,
      allergies: /allergy|allergic|gluten|dairy|nuts|dietary/i
    };

    for (const [intent, pattern] of Object.entries(intents)) {
      if (pattern.test(question)) return intent;
    }
    return 'general';
  }

  /**
   * Check cache for similar questions
   */
  async checkCache(question: string): Promise<CacheEntry | null> {
    try {
      const questionHash = this.hashQuestion(question);
      
      // 1. First check for exact hash match (fastest)
      console.log('🔍 Checking cache for exact match...');
      const { data: exactMatch } = await supabase
        .from('cached_queries')
        .select('*')
        .eq('question_hash', questionHash)
        .single();

      if (exactMatch) {
        console.log('✅ Found exact cache match');
        await this.updateCacheUsage(exactMatch.id);
        return {
          id: exactMatch.id,
          question: exactMatch.question,
          answer: exactMatch.answer,
          similarity: 1.0,
          usage_count: exactMatch.usage_count + 1,
          confidence: exactMatch.confidence,
          intent: exactMatch.intent,
          context_sources: exactMatch.context_sources || []
        };
      }

      // 2. If semantic caching is enabled, check vector similarity
      if (this.config.useSemanticCache) {
        console.log('🔍 Checking cache for semantic similarity...');
        const queryEmbedding = await generateEmbedding(question, true);
        
        const { data: similarMatches } = await supabase.rpc('find_similar_cached_queries', {
          query_embedding: queryEmbedding,
          similarity_threshold: this.config.semanticMatchThreshold,
          max_results: 3
        });

        if (similarMatches && similarMatches.length > 0) {
          const bestMatch = similarMatches[0];
          
          if (bestMatch.similarity >= this.config.exactMatchThreshold) {
            console.log(`✅ Found high-similarity cache match (${bestMatch.similarity.toFixed(3)})`);
            await this.updateCacheUsage(bestMatch.id);
            return bestMatch;
          } else if (bestMatch.similarity >= this.config.semanticMatchThreshold) {
            console.log(`⚡ Found semantic cache match (${bestMatch.similarity.toFixed(3)})`);
            // For semantic matches, we might want to update the cache with the new question variant
            await this.updateCacheUsage(bestMatch.id);
            return bestMatch;
          }
        }
      }

      console.log('❌ No cache match found');
      return null;
    } catch (error) {
      console.error('❌ Cache check error:', error);
      return null; // Fail silently and proceed without cache
    }
  }

  /**
   * Store new query and response in cache
   */
  async storeCache(
    question: string, 
    answer: string, 
    contextSources: string[] = [],
    confidence: number = 0.5
  ): Promise<void> {
    try {
      console.log('💾 Storing response in cache...');
      
      const questionHash = this.hashQuestion(question);
      const questionNormalized = this.normalizeQuestion(question);
      const intent = this.classifyIntent(question);
      const queryEmbedding = await generateEmbedding(question, true);
      
      const expiresAt = this.config.maxCacheAge > 0 
        ? new Date(Date.now() + this.config.maxCacheAge * 60 * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('cached_queries')
        .insert({
          question,
          question_hash: questionHash,
          question_normalized: questionNormalized,
          embedding: queryEmbedding,
          answer,
          context_sources: contextSources,
          intent,
          confidence,
          expires_at: expiresAt,
          tokens_saved: 0, // Will be updated on cache hits
          api_calls_saved: 0
        });

      if (error) {
        console.error('❌ Cache store error:', error);
      } else {
        console.log('✅ Response cached successfully');
      }
    } catch (error) {
      console.error('❌ Cache storage error:', error);
      // Don't throw - caching failures shouldn't break the main flow
    }
  }

  /**
   * Update cache usage statistics
   */
  private async updateCacheUsage(cacheId: string): Promise<void> {
    try {
      await supabase.rpc('update_cache_usage', { cache_id: cacheId });
    } catch (error) {
      console.error('❌ Cache usage update error:', error);
    }
  }

  /**
   * Get cache performance statistics
   */
  async getCacheStats(): Promise<any> {
    try {
      const { data } = await supabase.rpc('get_cache_stats');
      return data?.[0] || null;
    } catch (error) {
      console.error('❌ Cache stats error:', error);
      return null;
    }
  }

  /**
   * Clean up old cache entries
   */
  async cleanupCache(): Promise<number> {
    try {
      const { data } = await supabase.rpc('cleanup_query_cache', {
        min_usage_threshold: 2,
        max_age_days: 30,
        keep_pinned: true
      });
      
      console.log(`🧹 Cleaned up ${data || 0} cache entries`);
      return data || 0;
    } catch (error) {
      console.error('❌ Cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Pre-populate cache with common questions
   */
  async warmCache(commonQuestions: Array<{question: string, answer: string}>): Promise<void> {
    console.log('🔥 Warming cache with common questions...');
    
    for (const item of commonQuestions) {
      // Check if already cached to avoid duplicates
      const existing = await this.checkCache(item.question);
      if (!existing) {
        await this.storeCache(item.question, item.answer, [], 0.9); // High confidence for pre-warmed
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to avoid rate limits
      }
    }
    
    console.log('✅ Cache warming completed');
  }

  /**
   * Pin important queries to prevent cleanup
   */
  async pinQuery(questionHash: string): Promise<void> {
    try {
      await supabase
        .from('cached_queries')
        .update({ is_pinned: true })
        .eq('question_hash', questionHash);
    } catch (error) {
      console.error('❌ Pin query error:', error);
    }
  }
}

// Export singleton instance
export const queryCache = new QueryCache();