
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SamuAI: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Graça e Paz! Sou o Samu AI. Tenho acesso ao Esboço de Teologia de Langston e outras fontes batistas. Como posso te ajudar em seus estudos hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Fix: Ensure proper initialization of GoogleGenAI and use 'gemini-3-pro-preview' for specialized reasoning tasks
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMsg }] }],
        config: {
          systemInstruction: 'Você é o Samu AI, um tutor especializado em Teologia Batista Brasileira, focado na obra "Esboço de Teologia Sistemática" de A.B. Langston. Linguagem acadêmica mas acessível. Use princípios batistas de interpretação.',
          temperature: 0.7,
        }
      });

      // Fix: Strictly access .text as a property as per GenAI SDK guidelines
      const aiText = response.text || 'Desculpe, tive um problema ao processar sua dúvida teológica.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Ocorreu um erro na conexão. Tente novamente.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark animate-page-transition">
      <header className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-white/5 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="material-symbols-outlined text-gray-400">arrow_back</button>
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined fill-1">psychology</span>
          </div>
          <div>
            <h3 className="font-black tracking-tighter uppercase text-sm">Samu AI Tutor</h3>
            <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Ativo</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white dark:bg-surface-dark text-slate-800 dark:text-slate-200 rounded-tl-none border border-gray-100 dark:border-white/5'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-surface-dark p-4 rounded-[24px] rounded-tl-none border border-gray-100 dark:border-white/5 flex gap-1">
              <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-white/5 pb-8">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Dúvida sobre Langston?"
            className="w-full bg-gray-100 dark:bg-background-dark border-none ring-1 ring-gray-200 dark:ring-white/10 rounded-full py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-primary transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping}
            className="absolute right-2 size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SamuAI;