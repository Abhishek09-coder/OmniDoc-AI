const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    content: String,          
    embedding: [Number],      
    metadata: {               
        fileName: String,
        uploadedAt: { type: Date, default: Date.now }
    }
});

module.exports = mongoose.model('Document', documentSchema);