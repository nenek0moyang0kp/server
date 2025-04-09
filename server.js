const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const {
  GITHUB_TOKEN,
  GITHUB_USERNAME,
  GITHUB_REPO,
  FILE_PATH,
  BRANCH,
} = process.env;

const GITHUB_API = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`;

app.get('/products', async (req, res) => {
  try {
    const response = await fetch(`${GITHUB_API}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Gagal mengambil data produk.' });
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString();
    res.json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

app.put('/products', async (req, res) => {
  const products = req.body;

  try {
    // Get SHA of existing file
    const getRes = await fetch(`${GITHUB_API}?ref=${BRANCH}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const getData = await getRes.json();
    const sha = getData.sha;

    // Update file
    const updateRes = await fetch(GITHUB_API, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update products.json',
        content: Buffer.from(JSON.stringify(products, null, 2)).toString('base64'),
        branch: BRANCH,
        sha, // dari getData.sha
      }),
    });
    

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      return res.status(updateRes.status).json({ error: 'Gagal update produk.', detail: updateData });
    }

    res.json({ message: 'Produk berhasil diperbarui.', data: updateData });
  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
