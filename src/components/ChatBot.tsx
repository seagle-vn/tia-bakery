'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { formatMessageContent } from '@/lib/gtagHelper';

export default function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I&apos;m your AI assistant. I can help answer questions about our business, services, pricing, and policies. What would you like to know?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-6) // Send recent history
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        sources: data.sources
      };

      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I&apos;m having trouble connecting right now. Please try again in a moment or contact us directly for assistance.'
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Business Assistant</h3>
            <p className="text-blue-100 text-sm">Powered by AI • Ask me anything about our business</p>
          </div>
          <button
            onClick={() => setShowSources(!showSources)}
            className="text-sm bg-white/20 backdrop-blur px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
          >
            {showSources ? 'Hide Sources' : 'Show Sources'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <div key={index}>
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}>
                <div className="whitespace-pre-wrap">{formatMessageContent(message.content)}</div>
              </div>
            </div>
            
            {/* Sources */}
            {showSources && message.sources && message.sources.length > 0 && (
              <div className="mt-3 ml-4">
                <details className="text-xs text-gray-600">
                  <summary className="cursor-pointer font-medium hover:text-gray-800 flex items-center gap-1">
                    📚 Sources ({message.sources.length})
                  </summary>
                  <div className="mt-2 space-y-2">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="bg-gray-100 p-3 rounded-lg border-l-4 border-blue-300">
                        <div className="text-blue-600 font-mono text-xs mb-1">
                          Relevance: {((source.similarity || 0) * 100).toFixed(1)}%
                        </div>
                        <div className="text-gray-700">{source.content}</div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-600 px-4 py-3 rounded-2xl shadow-sm border">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Searching our knowledge base...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t">
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about our services, pricing, policies..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          This AI assistant uses your business documents to provide accurate information
        </p>
      </div>
    </div>
  );
} 