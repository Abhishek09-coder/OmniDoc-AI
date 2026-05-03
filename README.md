# OmniDoc AI 🧠📄
**A Universal Document Intelligence & RAG Engine built with the MERN Stack and Google Gemini.**

OmniDoc AI transforms static PDF documents into interactive knowledge bases. It utilizes a custom Retrieval-Augmented Generation (RAG) pipeline to chunk, embed, and semantically search through documents, providing hyper-accurate, context-aware answers using Google's state-of-the-art LLMs.

## 🚀 Technical Stack
* **Frontend:** React.js, Tailwind CSS, Axios, Lucide Icons
* **Backend:** Node.js, Express.js (MVC Architecture)
* **Database:** MongoDB Atlas (Vector Search & Data Persistence)
* **AI & NLP:** LangChain (`PDFLoader`, `RecursiveCharacterTextSplitter`), Google Gemini (`gemini-embedding-001`, `gemini-flash-lite-latest`)

## ⚙️ Core Architecture & Workflow
1. **Document Ingestion:** Uploaded PDFs are parsed and split into overlapping chunks (1000 characters each with a 200-character overlap) to preserve contextual integrity.
2. **Vector Embeddings:** Chunks are processed via the `gemini-embedding-001` model, converting text into 768-dimensional vector representations.
3. **Database Indexing:** Vectors and metadata (filename, timestamp) are stored in MongoDB Atlas with a dedicated `$vectorSearch` index.
4. **Semantic Retrieval (RAG):** User queries are embedded and compared against the vector database using Approximate Nearest Neighbor (ANN) search to fetch the top 3 most relevant context chunks.
5. **Generative Response:** The retrieved context is injected into a strict system prompt and fed to the `gemini-flash-lite` model to generate hallucination-free, highly accurate responses.

## 🛠️ Local Setup
1. Clone the repository.
2. Navigate to the `backend` directory, run `npm install`.
3. Create a `.env` file with your `MONGO_URI`. 
4. Add your Gemini API Key in `config/aiConfig.js`.
5. Run `npx nodemon server.js` for the backend.
6. Navigate to the `frontend` directory, run `npm install`, then `npm run dev`.