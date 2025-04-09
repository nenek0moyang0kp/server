import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { Octokit } from '@octokit/rest';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Inisialisasi Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Buat folder uploads jika belum ada
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup multer
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

// =================== ENDPOINTS =================== //

// Upload gambar
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `https://ybstudio-production.up.railway.app/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// GET products from GitHub
app.get('/products', async (req, res) => {
  try {
    const response = await octokit.repos.getContent({
      owner: 'calioralam',
      repo: 'YBStudio',
      path: 'products.json',
    });

    if (response.status !== 200) {
      console.error("❌ Unexpected response from GitHub:", response.status, response.data);
      return res.status(500).json({ error: 'Unexpected response from GitHub.' });
    }

    const content = Buffer.from(response.data.content, 'base64').toString('utf-8').trim();

    let json;
    try {
      json = JSON.parse(content);
    } catch (err) {
      console.error('🔥 Gagal update ke GitHub:', err.response?.data || err.message);
    
      res.status(500).json({
        error: 'Failed to update products on GitHub.',
        detail: err.response?.data || err.message,
      });
    
    }

    res.json(json);
  } catch (error) {
    console.error("🔥 Gagal fetch data dari GitHub:", error);
    res.status(500).json({ error: 'Gagal fetch data dari GitHub.' });
  }
});

// POST products (update to GitHub)
app.post('/products', async (req, res) => {
  try {
    const { GITHUB_REPO, GITHUB_FILE, GITHUB_TOKEN } = process.env;

    if (!GITHUB_REPO || !GITHUB_FILE || !GITHUB_TOKEN) {
      return res.status(500).json({ error: 'Missing environment variables.' });
    }

    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

    // Ambil sha dulu
    const getRes = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const sha = getRes.data.sha;
    const updatedData = req.body;

    // Validasi updatedData harus array (produk)
    if (!Array.isArray(updatedData)) {
      return res.status(400).json({ error: 'Payload harus berupa array of products.' });
    }

    const jsonString = JSON.stringify(updatedData, null, 2);
    const encodedContent = Buffer.from(jsonString).toString('base64');

    const putRes = await axios.put(
      apiUrl,
      {
        message: 'Update product list',
        content: encodedContent,
        sha,
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    res.json({ success: true, commit: putRes.data.commit.sha });
  } catch (err) {
    console.error('🔥 Gagal update ke GitHub:', err.response?.data || err.message);
  
    res.status(500).json({
      error: 'Failed to update products on GitHub.',
      detail: err.response?.data || err.message,
    });
  
    res.status(500).json({
      error: 'Failed to update products on GitHub.',
      detail: err.response?.data || err.message,
    });
  }
});

// Tes endpoint
app.get('/', (req, res) => {
  res.send('Server berjalan 👍');
});

// Debug info saat server start
console.log("🔐 GITHUB_TOKEN:", process.env.GITHUB_TOKEN ? '✅ Detected' : '❌ Missing');
console.log("📁 GITHUB_REPO:", process.env.GITHUB_REPO);
console.log("📄 GITHUB_FILE:", process.env.GITHUB_FILE);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
