import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding } from '@/lib/embeddings';
import { searchDocuments } from '@/lib/supabase';
import { generateChatResponse } from '@/lib/groq';
import { ChatMessage } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] }: { message: string; history: ChatMessage[] } = await request.json();

    console.log('🔍 Generating embedding for query...');
    const queryEmbedding = await generateEmbedding(message);

    console.log('📚 Searching for relevant documents...');
    const documents = await searchDocuments(queryEmbedding, 0.6, 3);

    const context = documents
      .map(doc => doc.content)
      .join('\n\n');

    const systemPrompt = `You are a helpful customer service assistant for our business. Use the following information from our business documents to answer the customer's question accurately and professionally.

BUSINESS INFORMATION:
${context}

INSTRUCTIONS:
- Answer based ONLY on the provided business information
- Be helpful, friendly, and professional
- If the information isn't available in the context, politely say you don't have that specific information
- Suggest contacting the business directly for complex issues
- Keep responses concise but complete
- Use a conversational tone

Customer question: ${message}`;

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