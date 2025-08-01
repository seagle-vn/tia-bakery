import { createClient } from '@supabase/supabase-js';
import { DocumentChunk } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function searchDocuments(
  queryEmbedding: number[],
  matchThreshold: number = 0.7,
  matchCount: number = 3
): Promise<DocumentChunk[]> {
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

export async function insertDocumentChunk(
  content: string,
  embedding: number[],
  metadata: Record<string, any> = {}
) {
  const { error } = await supabase
    .from('document_chunks')
    .insert({
      content,
      embedding,
      metadata
    });

  if (error) {
    console.error('Insert error:', error);
    throw error;
  }
} 