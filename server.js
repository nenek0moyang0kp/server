import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { Octokit } from '@octokit/rest'; // ✅ tambahkan ini

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Buat folder uploads kalau belum ada
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
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

// Inisialisasi Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const { GITHUB_REPO, GITHUB_FILE } = process.env;

// Upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `https://ybstudio-production.up.railway.app/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// GET products
app.get('/products', async (req, res) => {
  try {
    const response = await octokit.repos.getContent({
      owner: 'calioralam',
      repo: 'YBStudio',
      path: 'products.json',
    });

    const content = Buffer.from(response.data.content, 'base64').toString();
    const json = JSON.parse(content);
    res.json(json);
  } catch (error) {
    console.error("🔥 Gagal fetch data dari GitHub:", error.message);
    res.status(500).json({ error: 'Gagal fetch data dari GitHub.' });
  }
});

// POST products (overwrite)
app.post('/products', async (req, res) => {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;

    const getRes = await axios.get(apiUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const sha = getRes.data.sha;
    const updatedData = req.body;
    const encodedContent = Buffer.from(JSON.stringify(updatedData, null, 2)).toString('base64');

    await axios.put(
      apiUrl,
      {
        message: 'update product',
        content: encodedContent,
        sha,
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('🔥 Gagal update ke GitHub:', err.message);
    res.status(500).json({ error: 'Failed to update products on GitHub.' });
  }
});

app.get('/', (req, res) => {
  res.send('Server berjalan 👍');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
