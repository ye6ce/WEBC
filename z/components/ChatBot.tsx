
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { chatWithSupport } from '../services/gemini';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
    { role: 'model', content: "Welcome to K-SHOP. I am your concierge. How may I assist you with our collections today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithSupport(userMsg, messages);
      setMessages(prev => [...prev, { role: 'model', content: response || "I apologize, I am momentarily unavailable." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Something went wrong. Please try again later." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150]">
      {isOpen ? (
        <div className="bg-white w-[350px] h-[500px] shadow-2xl rounded-2xl flex flex-col border border-gray-100 overflow-hidden animate-slide-up">
          <div className="bg-black p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-gold-500" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase">K-SHOP CONCIERGE</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>
          
          <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 custom-scrollbar bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-black text-white' : 'bg-white border text-gray-800 shadow-sm'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-2xl text-xs text-gray-400 italic flex items-center gap-2">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about products, heritage..."
                className="flex-grow text-xs px-4 py-3 bg-gray-50 rounded-full outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-black text-white rounded-full disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all group"
        >
          <MessageSquare className="group-hover:hidden" />
          <Sparkles className="hidden group-hover:block text-gold-500 animate-pulse" />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
