-- Enhanced cached_queries table optimized for Supabase-only caching
CREATE TABLE IF NOT EXISTS cached_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Question data
  question text NOT NULL,
  question_hash text UNIQUE NOT NULL, -- For exact duplicate detection
  question_normalized text, -- Cleaned/normalized version
  
  -- Embedding and matching
  embedding vector(384), -- Using 384 for BGE-small-en-v1.5 consistency
  
  -- Cached response data
  answer text NOT NULL,
  context_sources text[], -- Which document chunks were used
  
  -- Performance tracking
  usage_count integer DEFAULT 1,
  last_used_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now(),
  
  -- Quality metrics  
  intent varchar(50), -- 'pricing', 'hours', 'policies', etc.
  confidence real DEFAULT 0.5, -- Response confidence score
  user_feedback integer, -- 1=good, 0=neutral, -1=bad
  
  -- Cost optimization tracking
  tokens_saved integer DEFAULT 0,
  api_calls_saved integer DEFAULT 0,
  
  -- Cache management
  is_pinned boolean DEFAULT false, -- Keep important queries
  expires_at timestamp -- Optional expiration
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_cached_queries_embedding 
  ON cached_queries USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_cached_queries_hash 
  ON cached_queries(question_hash);
  
CREATE INDEX IF NOT EXISTS idx_cached_queries_normalized 
  ON cached_queries(question_normalized);

CREATE INDEX IF NOT EXISTS idx_cached_queries_intent 
  ON cached_queries(intent);

CREATE INDEX IF NOT EXISTS idx_cached_queries_usage 
  ON cached_queries(usage_count DESC, last_used_at DESC);

-- Removed the WHERE clause with now() function since it's not immutable
CREATE INDEX IF NOT EXISTS idx_cached_queries_recent 
  ON cached_queries(last_used_at DESC);

-- Function to find similar cached queries
CREATE OR REPLACE FUNCTION find_similar_cached_queries(
  query_embedding vector(384),
  similarity_threshold float DEFAULT 0.85,
  max_results int DEFAULT 5,
  exclude_expired boolean DEFAULT true
)
RETURNS TABLE (
  id uuid,
  question text,
  answer text,
  similarity float,
  usage_count int,
  confidence real,
  intent varchar(50),
  context_sources text[]
) AS $$
BEGIN
  IF exclude_expired THEN
    RETURN QUERY
    SELECT 
      cq.id,
      cq.question,
      cq.answer,
      1 - (cq.embedding <=> query_embedding) as similarity,
      cq.usage_count,
      cq.confidence,
      cq.intent,
      cq.context_sources
    FROM cached_queries cq
    WHERE 
      1 - (cq.embedding <=> query_embedding) >= similarity_threshold
      AND (cq.expires_at IS NULL OR cq.expires_at > CURRENT_TIMESTAMP)
    ORDER BY 
      cq.embedding <=> query_embedding,
      cq.usage_count DESC,
      cq.confidence DESC
    LIMIT max_results;
  ELSE
    RETURN QUERY
    SELECT 
      cq.id,
      cq.question,
      cq.answer,
      1 - (cq.embedding <=> query_embedding) as similarity,
      cq.usage_count,
      cq.confidence,
      cq.intent,
      cq.context_sources
    FROM cached_queries cq
    WHERE 
      1 - (cq.embedding <=> query_embedding) >= similarity_threshold
    ORDER BY 
      cq.embedding <=> query_embedding,
      cq.usage_count DESC,
      cq.confidence DESC
    LIMIT max_results;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update cache usage
CREATE OR REPLACE FUNCTION update_cache_usage(cache_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE cached_queries 
  SET 
    usage_count = usage_count + 1,
    last_used_at = CURRENT_TIMESTAMP,
    tokens_saved = tokens_saved + 50, -- Estimated tokens per response
    api_calls_saved = api_calls_saved + 1
  WHERE id = cache_id;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old/unused cache entries
CREATE OR REPLACE FUNCTION cleanup_query_cache(
  min_usage_threshold int DEFAULT 2,
  max_age_days int DEFAULT 30,
  keep_pinned boolean DEFAULT true
)
RETURNS int AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM cached_queries 
  WHERE 
    (NOT keep_pinned OR NOT is_pinned)
    AND (
      (created_at < CURRENT_TIMESTAMP - interval '1 day' * max_age_days AND usage_count < min_usage_threshold)
      OR (expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP)
    );
    
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get cache statistics
CREATE OR REPLACE FUNCTION get_cache_stats()
RETURNS TABLE (
  total_queries bigint,
  total_usage bigint,
  avg_usage numeric,
  tokens_saved bigint,
  api_calls_saved bigint,
  cache_hit_potential numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_queries,
    SUM(usage_count) as total_usage,
    AVG(usage_count) as avg_usage,
    SUM(tokens_saved) as tokens_saved,
    SUM(api_calls_saved) as api_calls_saved,
    CASE 
      WHEN COUNT(*) > 0 THEN (SUM(api_calls_saved)::numeric / (SUM(api_calls_saved) + COUNT(*))) * 100
      ELSE 0 
    END as cache_hit_potential
  FROM cached_queries;
END;
$$ LANGUAGE plpgsql;

ANALYZE cached_queries;