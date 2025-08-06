import { generateEmbedding } from '@/lib/embeddings';
import { generateChatResponse } from '@/lib/groq';
import { searchDocuments } from '@/lib/supabase';
import { ChatMessage } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] }: { message: string; history: ChatMessage[] } = await request.json();

    console.log('🔍 Generating embedding for query...', message);
    const queryEmbedding = await generateEmbedding(message, true);

    console.log('📚 Searching for relevant documents...');
    // Lower threshold for better recall, get more documents
    const documents = await searchDocuments(queryEmbedding, 0.3, 5);

    const context = documents
      .map(doc => doc.content)
      .join('\n\n');

    const systemPrompt = `You are Tia's friendly bakery assistant. Use the provided business information to help customers with their questions about Tia Bakery.

BUSINESS INFORMATION:
${context}

KEY INSTRUCTIONS:
- Answer ONLY using the provided business information above
- Be warm, friendly, and enthusiastic about our bakery
- If you don't have specific information, suggest contacting Tia directly
- For orders: Always mention calling ahead, especially for custom cakes
- Use specific details from the context when available (prices, hours, etc.)
- Keep responses helpful but concise
- End with a friendly closing when appropriate

Customer: ${message}
Assistant:`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4), // Keep last 4 messages for context
      { role: 'user', content: message }
    ];

    console.log('🤖 Generating AI response...');
    const aiResponse = await generateChatResponse(messages);

    return NextResponse.json({
      response: aiResponse,
      sources: documents.map(doc => ({
        content: doc.content.substring(0, 200) + '...',
        similarity: doc.similarity
      }))
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    return NextResponse.json({
      error: 'I apologize, but I\'m experiencing technical difficulties. Please try again in a moment, or contact us directly for assistance.'
    }, { status: 500 });
  }
} 