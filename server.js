import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); // serve file statis

// Buat folder uploads kalau belum ada
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // rekursif biar aman
}

// Multer setup untuk upload file ke folder uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Upload image endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// --- GitHub Setup ---
const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_FILE } = process.env;

const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

const headers = {
  Authorization: `token ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github.v3+json',
};

// GET products
app.get('/products', async (req, res) => {
  try {
    const response = await axios.get(apiUrl, { headers });
    const content = Buffer.from(response.data.content, 'base64').toString();
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products from GitHub.' });
  }
});

// POST products (replace all)
app.post('/products', async (req, res) => {
  try {
    const getRes = await axios.get(apiUrl, { headers });
    const sha = getRes.data.sha;

    const updatedData = req.body;
    const encodedContent = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');

    await axios.put(apiUrl, {
      message: 'update product',
      content: encodedContent,
      sha,
    }, { headers });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update products on GitHub.' });
  }
});

app.get('/', (req, res) => {
  res.send('Server berjalan 👍');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
