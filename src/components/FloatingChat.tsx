'use client';

import { formatMessageContent } from '@/lib/gtagHelper';
import { ChatMessage } from '@/types';
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './FloatingChat.module.css';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I&apos;m Tia&apos;s AI assistant! 👋 I&apos;m here to help you with any questions about custom cakes, flavors, ordering, or anything else about the bakery. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isOpen && !target.closest(`.${styles.chatWindow}`) && !target.closest(`.${styles.aiAssistantButton}`)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside as any);
    return () => {
      document.removeEventListener('click', handleClickOutside as any);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button 
        className={styles.aiAssistantButton} 
        onClick={toggleChat}
      >
        <span className={styles.icon}>🤖</span>
        <span>Ask AI Assistant</span>
      </button>

      {/* Chat Window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <h3>Tia&apos;s Assistant</h3>
          <button className={styles.chatClose} onClick={toggleChat}>&times;</button>
        </div>
        
        <div className={styles.chatMessages}>
          {messages.map((message, index) => (
            <div key={index} className={`${styles.message} ${message.role === 'assistant' ? styles.bot : styles.user}`}>
              <div>{formatMessageContent(message.content)}</div>
              <div className={styles.messageTime}>
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className={`${styles.typingIndicator} ${styles.show}`}>
              <div className={styles.typingDots}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className={styles.chatInputContainer}>
          <div className={styles.chatInputWrapper}>
            <textarea 
              className={styles.chatInput} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Tia's cakes..."
              rows={1}
              disabled={isLoading}
            />
            <button 
              className={styles.chatSend} 
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 