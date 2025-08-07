-- Simple cache table setup (no complex indexes that might cause issues)
CREATE TABLE IF NOT EXISTS cached_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Question data
  question text NOT NULL,
  question_hash text UNIQUE NOT NULL,
  question_normalized text,
  
  -- Embedding and matching  
  embedding vector(384),
  
  -- Cached response data
  answer text NOT NULL,
  context_sources text[],
  
  -- Performance tracking
  usage_count integer DEFAULT 1,
  last_used_at timestamp DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  
  -- Quality metrics
  intent varchar(50),
  confidence real DEFAULT 0.5,
  user_feedback integer,
  
  -- Cost optimization tracking
  tokens_saved integer DEFAULT 0,
  api_calls_saved integer DEFAULT 0,
  
  -- Cache management
  is_pinned boolean DEFAULT false,
  expires_at timestamp
);

-- Essential indexes only
CREATE INDEX IF NOT EXISTS idx_cached_queries_hash 
  ON cached_queries(question_hash);
  
CREATE INDEX IF NOT EXISTS idx_cached_queries_usage 
  ON cached_queries(usage_count DESC, last_used_at DESC);

-- Try to create vector index (this might require pgvector extension)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') THEN
    CREATE INDEX IF NOT EXISTS idx_cached_queries_embedding 
      ON cached_queries USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  ELSE
    RAISE NOTICE 'pgvector extension not found - vector search will be slower';
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not create vector index - vector search will be slower';
END $$;

-- Basic function to find similar cached queries
CREATE OR REPLACE FUNCTION find_similar_cached_queries(
  query_embedding vector(384),
  similarity_threshold float DEFAULT 0.85,
  max_results int DEFAULT 5
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
  RETURN QUERY
  SELECT 
    cq.id,
    cq.question,
    cq.answer,
    (1 - (cq.embedding <=> query_embedding))::float as similarity,
    cq.usage_count,
    cq.confidence,
    cq.intent,
    cq.context_sources
  FROM cached_queries cq
  WHERE 
    cq.embedding IS NOT NULL
    AND (1 - (cq.embedding <=> query_embedding)) >= similarity_threshold
    AND (cq.expires_at IS NULL OR cq.expires_at > CURRENT_TIMESTAMP)
  ORDER BY 
    cq.embedding <=> query_embedding,
    cq.usage_count DESC
  LIMIT max_results;
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
    tokens_saved = tokens_saved + 50,
    api_calls_saved = api_calls_saved + 1
  WHERE id = cache_id;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old cache entries
CREATE OR REPLACE FUNCTION cleanup_query_cache(
  min_usage_threshold int DEFAULT 2,
  max_age_days int DEFAULT 30
)
RETURNS int AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM cached_queries 
  WHERE 
    NOT is_pinned
    AND (
      (created_at < CURRENT_TIMESTAMP - make_interval(days => max_age_days) AND usage_count < min_usage_threshold)
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
    COUNT(*)::bigint as total_queries,
    COALESCE(SUM(usage_count), 0)::bigint as total_usage,
    COALESCE(AVG(usage_count), 0) as avg_usage,
    COALESCE(SUM(tokens_saved), 0)::bigint as tokens_saved,
    COALESCE(SUM(api_calls_saved), 0)::bigint as api_calls_saved,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COALESCE(SUM(api_calls_saved), 0)::numeric / 
         (COALESCE(SUM(api_calls_saved), 0) + COUNT(*))) * 100
      ELSE 0 
    END as cache_hit_potential
  FROM cached_queries;
END;
$$ LANGUAGE plpgsql;

-- Analyze table for better query planning
ANALYZE cached_queries;