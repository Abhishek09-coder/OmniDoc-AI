require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// DB Connection
connectDB();

// Use Routes
app.use('/api', apiRoutes);

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 OmniDoc AI running on http://127.0.0.1:${PORT}`);
});