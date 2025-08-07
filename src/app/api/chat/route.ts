import { generateEmbedding } from '@/lib/embeddings';
import { generateChatResponse } from '@/lib/groq';
import { searchDocuments } from '@/lib/supabase';
import { queryCache } from '@/lib/cache';
import { ChatMessage } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { message, history = [] }: { message: string; history: ChatMessage[] } = await request.json();

    // 1. Check cache first
    console.log('🔍 Checking query cache...');
    const cachedResult = await queryCache.checkCache(message);
    
    if (cachedResult) {
      const responseTime = Date.now() - startTime;
      console.log(`⚡ Cache hit! Response time: ${responseTime}ms`);
      
      return NextResponse.json({
        response: cachedResult.answer,
        cached: true,
        cacheHit: true,
        similarity: cachedResult.similarity,
        intent: cachedResult.intent,
        responseTime,
        sources: cachedResult.context_sources?.map((source: string) => ({
          content: source.substring(0, 200) + '...',
          cached: true
        })) || []
      });
    }

    // 2. If not cached, generate new response
    console.log('💫 Cache miss - generating new response...');
    console.log('🔍 Generating embedding for query...', message);
    const queryEmbedding = await generateEmbedding(message, true);

    console.log('📚 Searching for relevant documents...');
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
- If you don't have specific information or are unsure about any details, direct customers to contact Tia personally:
  * Email: [YOUR_EMAIL_HERE]
  * Phone: [YOUR_PHONE_HERE]
- For orders: Always mention calling ahead, especially for custom cakes
- Use specific details from the context when available (prices, hours, etc.)
- Keep responses helpful but concise
- When you cannot find information in the business context, always say: "I don't have that specific information, but Tia would be happy to help you personally! Please reach out to her at [YOUR_EMAIL_HERE] or call [YOUR_PHONE_HERE]."
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

    // 3. Store in cache for future use
    const contextSources = documents.map(doc => doc.content);
    const confidence = documents.length > 0 ? Math.min(documents[0].similarity || 0.5, 1.0) : 0.3;
    
    // Don't await cache storage to avoid slowing down response
    queryCache.storeCache(message, aiResponse, contextSources, confidence).catch(err => 
      console.error('Cache storage failed:', err)
    );

    const responseTime = Date.now() - startTime;
    console.log(`✅ New response generated in ${responseTime}ms`);

    return NextResponse.json({
      response: aiResponse,
      cached: false,
      cacheHit: false,
      responseTime,
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