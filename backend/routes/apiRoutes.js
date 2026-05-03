const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { uploadDocument, getFiles, deleteFile } = require('../controllers/fileController');
const { handleChat } = require('../controllers/chatController');

// Multer Config
const upload = multer({ dest: 'uploads/' });

// API Endpoints
router.post('/upload', upload.single('document'), uploadDocument);
router.get('/files', getFiles);
router.delete('/files/:fileName', deleteFile);
router.post('/chat', handleChat);

module.exports = router;