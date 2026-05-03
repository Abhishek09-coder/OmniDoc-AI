import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const ChatInput = ({ question, setQuestion, handleChat, loading, selectedFile }) => {
  return (
    <div className="p-6 bg-white border-t border-zinc-100 z-10">
      <form onSubmit={handleChat} className="max-w-4xl mx-auto relative group">
        <input 
          type="text" 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={selectedFile ? `Ask anything about ${selectedFile}...` : "Choose a file to start vector search..."}
          className="w-full p-4 pr-16 bg-zinc-50/50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-zinc-800 placeholder:text-zinc-400 text-[15px]"
        />
        <button 
          type="submit" 
          disabled={loading || !question}
          className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white flex items-center justify-center rounded-xl hover:bg-indigo-700 disabled:opacity-30 disabled:hover:bg-indigo-600 transition-all shadow-md active:scale-95"
        >
          <Send size={18} />
        </button>
      </form>
      <div className="flex items-center justify-center gap-4 mt-4">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">RAG Engine Active</span>
        </div>
        <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Gemini Neural Core</span>
      </div>
    </div>
  );
};

export default ChatInput;