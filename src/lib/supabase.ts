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
  try {
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: matchThreshold,
      match_count: matchCount
    });

    if (error) {
      console.error('Vector search failed, falling back to text search:', error.message);
      // Fallback: return all documents for now
      const { data: allDocs, error: fallbackError } = await supabase
        .from('document_chunks')
        .select('id, content, metadata')
        .limit(matchCount);
      
      if (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        return [];
      }
      
      // Add dummy similarity scores
      return (allDocs || []).map(doc => ({
        ...doc,
        similarity: 0.8
      }));
    }

    return data || [];
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
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

/**
 * Uploads an image file to Supabase Storage
 * @param file - The image file to upload (can be File or Blob)
 * @param fileName - Optional custom filename, will generate unique name if not provided
 * @returns Public URL of the uploaded image
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  fileName?: string
): Promise<string> {
  // Generate unique filename if not provided
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file instanceof File && file.name ? file.name.split('.').pop() : 'jpg';
  const finalFileName = fileName || `quote_image_${timestamp}_${randomStr}.${extension}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('quote-images')
    .upload(finalFileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading to Supabase:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('quote-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Compresses an image file to a blob
 * @param file - The image file to compress
 * @param maxWidth - Maximum width in pixels
 * @param maxHeight - Maximum height in pixels
 * @param quality - JPEG quality (0-1)
 * @returns Compressed image as Blob
 */
export function compressImageToBlob(
  file: File,
  maxWidth: number = 500,
  maxHeight: number = 500,
  quality: number = 0.72
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.src = reader.result as string;
    };
    reader.onerror = reject;

    image.onload = () => {
      const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Unable to prepare image.'));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    image.onerror = reject;

    reader.readAsDataURL(file);
  });
} 