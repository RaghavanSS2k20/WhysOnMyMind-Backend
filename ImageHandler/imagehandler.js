const express = require('express');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');

const mongoose = require('mongoose');
const c = require('./DB/connect')
const db = mongoose.connection
const cors = require('cors')
const router = express();
router.use(cors())
console.log(db)
// Set up GridFSBucketuploa
const gridFSBucket = new GridFSBucket(db);

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store images in memory
const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const imageBuffer = req.file.buffer;

    // Upload the image to GridFS
    const uploadStream = gridFSBucket.openUploadStream(req.file.originalname);
    uploadStream.end(imageBuffer);

    // Respond with the URL of the uploaded image
    const imageUrl = `http://localhost:8081/images/${uploadStream.id}`;
    console.log(imageUrl)
    res.status(201).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/images/:id', (req, res) => {
    const imageId = new ObjectId(req.params.id);
    const downloadStream = gridFSBucket.openDownloadStream(imageId);
  
    downloadStream.pipe(res);
  });

const PORT =  8081;
router.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
