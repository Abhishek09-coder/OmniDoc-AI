require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Middleware: Updated CORS to allow your Vercel frontend
app.use(cors({ 
    origin: [
        "http://localhost:5173", 
        "https://omni-doc-ai.vercel.app" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());

// DB Connection
connectDB();

// Use Routes
app.use('/api', apiRoutes);

// Root route to check if server is alive (Optional)
app.get('/', (req, res) => res.send("OmniDoc AI Backend is Live! 🚀"));

app.listen(PORT, () => {
    console.log(`🚀 OmniDoc AI running on port ${PORT}`);
});