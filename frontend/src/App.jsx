import React, { useState, useEffect, useRef } from 'react';
import { Eraser } from 'lucide-react';
import api from './services/api';

// Import Components
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchFiles();
    const savedMessages = localStorage.getItem('omnidoc_chat');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    if (messages.length > 0) localStorage.setItem('omnidoc_chat', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const fetchFiles = async () => {
    try {
      const res = await api.get('/files');
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    setUploading(true);
    try {
      await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchFiles();
    } catch (err) {
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
      e.target.value = null; 
    }
  };

  const handleDelete = async (e, fileName) => {
    e.stopPropagation();
    if (!window.confirm(`Delete ${fileName} and its vector embeddings?`)) return;

    try {
      await api.delete(`/files/${fileName}`);
      if (selectedFile === fileName) setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      alert("Failed to delete file.");
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear all session history?")) {
      setMessages([]);
      localStorage.removeItem('omnidoc_chat');
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!question || loading) return;

    const userText = question;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);
    setQuestion("");

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await api.post('/chat', {
        question: userText,
        history,
        fileName: selectedFile
      });

      setMessages(prev => [...prev, { sender: 'ai', text: res.data.answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "System error: Unable to connect to inference engine." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f4f5] font-sans text-zinc-900 selection:bg-indigo-500/30">
      <Sidebar 
        files={files} 
        selectedFile={selectedFile} 
        setSelectedFile={setSelectedFile} 
        handleUpload={handleUpload} 
        handleDelete={handleDelete} 
        uploading={uploading} 
      />

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-20 flex items-center justify-between px-8 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${selectedFile ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse' : 'bg-amber-500'}`}></div>
            <div>
              <h2 className="text-sm font-bold text-zinc-800 truncate max-w-md">
                {selectedFile ? selectedFile : "Global Analysis Mode"}
              </h2>
              <p className="text-[11px] text-zinc-500 font-medium">
                {selectedFile ? 'Isolated Context Active' : 'Select a document to narrow search scope'}
              </p>
            </div>
          </div>
          
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="flex items-center gap-2 text-zinc-400 hover:text-red-500 text-xs font-bold transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <Eraser size={16} /> Reset Context
            </button>
          )}
        </header>

        <ChatWindow messages={messages} loading={loading} scrollRef={scrollRef} />
        
        <ChatInput 
          question={question} 
          setQuestion={setQuestion} 
          handleChat={handleChat} 
          loading={loading} 
          selectedFile={selectedFile} 
        />
      </div>
    </div>
  );
}

export default App;