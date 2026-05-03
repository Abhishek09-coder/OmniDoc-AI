import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatWindow = ({ messages, loading, scrollRef }) => {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-50/50 scroll-smooth">
      {messages.length === 0 && (
        <div className="h-full flex flex-col items-center justify-center text-zinc-400">
          <div className="bg-white p-6 rounded-3xl shadow-sm mb-4 border border-zinc-100">
            <Bot size={40} className="text-indigo-600/40" />
          </div>
          <p className="text-sm font-semibold text-zinc-500">Upload a PDF or select a document to start extracting insights.</p>
        </div>
      )}

      {messages.map((m, i) => (
        <div key={i} className={`flex gap-4 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === 'user' ? 'bg-zinc-800 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
            {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
          </div>
          <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${
            m.sender === 'user' 
            ? 'bg-zinc-900 text-zinc-50 rounded-tr-none' 
            : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
          }`}>
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Bot size={16} />
          </div>
          <div className="bg-white border border-zinc-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Parsing Data</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;