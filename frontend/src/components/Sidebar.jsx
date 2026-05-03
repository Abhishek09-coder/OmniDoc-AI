import React from 'react';
import { FileText, Trash2, Upload, Loader2, Bot } from 'lucide-react';

const Sidebar = ({ files, selectedFile, setSelectedFile, handleUpload, handleDelete, uploading }) => {
  return (
    <div className="w-72 bg-[#09090b] text-zinc-100 p-6 flex flex-col shadow-2xl z-20 h-full">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
          <Bot size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          OmniDoc AI
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Knowledge Base</p>
          <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full">{files.length}</span>
        </div>
        
        <div className="space-y-1">
          {files.map(file => (
            <div 
              key={file}
              onClick={() => setSelectedFile(file)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                selectedFile === file 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              <FileText size={18} className={selectedFile === file ? 'text-white' : 'text-zinc-600 group-hover:text-indigo-400'} />
              <span className="flex-1 truncate text-sm font-medium">{file}</span>
              <Trash2 
                size={14} 
                className={`transition-all duration-200 ${
                  selectedFile === file ? 'text-indigo-200 hover:text-white' : 'text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100'
                }`}
                onClick={(e) => handleDelete(e, file)}
              />
            </div>
          ))}
        </div>
      </div>

      <label className="mt-6 cursor-pointer group">
        <div className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold transition-all border border-dashed ${
          uploading ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-800/30 border-zinc-700 hover:border-indigo-500 hover:bg-zinc-800/50'
        }`}>
          {uploading ? <Loader2 className="animate-spin text-indigo-500" /> : <Upload size={20} className="text-indigo-500 group-hover:scale-110 transition-transform" />}
          <span className="text-sm text-zinc-300">{uploading ? 'Indexing Vector...' : 'Upload Document'}</span>
        </div>
        <input type="file" className="hidden" onChange={handleUpload} accept=".pdf" disabled={uploading} />
      </label>
    </div>
  );
};

export default Sidebar;