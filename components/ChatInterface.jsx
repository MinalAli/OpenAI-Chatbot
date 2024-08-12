import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ChatInterface = ({ user, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { t } = useTranslation();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add initial greeting when the chat is opened
    setMessages([
      { 
        id: Date.now(), 
        role: 'assistant', 
        content: "Hello! I'm Headstarter's AI agent. How can I help you?"
      }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: data.content };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'error',
        content: `Error: ${error.message}. Please try again.`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 w-full max-w-4xl h-[80vh] flex flex-col rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-4 bg-indigo-600 rounded-t-lg">
          <h2 className="text-lg font-bold text-white">{t('Headstarter Support')}</h2>
          <button onClick={onClose} className="text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded ${
                message.role === 'user' ? 'bg-indigo-600' : 
                message.role === 'assistant' ? 'bg-gray-700' : 'bg-red-600'
              } text-white`}>
                {message.content}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="mb-4 text-left">
              <span className="inline-block p-2 rounded bg-gray-600 text-white">Typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-700">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-gray-800 text-white p-2 rounded-l"
              placeholder={t('Type your message...')}
            />
            <button onClick={sendMessage} className="bg-indigo-600 text-white p-2 rounded-r">
              {t('Send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
