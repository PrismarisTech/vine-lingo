import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { APP_ACCENT_COLOR } from '../constants';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

export const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Hi! I\'m your Vine Assistant. Ask me about glossary terms, rules like ETV or Evaluation periods, or how to stay out of "Vine Jail".'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting right now. Please try again.",
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative transition-colors">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                <div 
                  className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm
                    ${msg.role === 'user' ? 'bg-slate-800' : 'bg-white dark:bg-slate-900'}`}
                  style={msg.role === 'model' ? { border: `1px solid ${APP_ACCENT_COLOR}` } : {}}
                >
                  {msg.role === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5" style={{ color: APP_ACCENT_COLOR }} />
                  )}
                </div>
                
                <div
                  className={`
                    relative px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${msg.role === 'user' 
                      ? `text-white rounded-br-none` 
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800'}
                    ${msg.isError ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : ''}
                  `}
                  style={msg.role === 'user' ? { backgroundColor: APP_ACCENT_COLOR } : {}}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="flex items-end gap-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                    <Sparkles className="h-4 w-4 animate-pulse" style={{ color: APP_ACCENT_COLOR }} />
                  </div>
                  <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#09BE82]/20 focus-within:border-[#09BE82] transition-all">
            <input
              type="text"
              className="flex-1 ml-4 bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm"
              placeholder="Ask about Vine rules..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`p-2 rounded-full transition-all duration-200 ${
                !inputValue.trim() || isLoading ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500' : 'text-white shadow-md transform hover:scale-105 active:scale-95'
              }`}
              style={inputValue.trim() && !isLoading ? { backgroundColor: APP_ACCENT_COLOR } : {}}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};