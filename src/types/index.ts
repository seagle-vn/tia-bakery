export interface DocumentChunk {
  id: number;
  content: string;
  embedding?: number[];
  metadata: Record<string, any>;
  similarity?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: DocumentChunk[];
}

export interface EmbeddingResponse {
  embedding: number[];
} 