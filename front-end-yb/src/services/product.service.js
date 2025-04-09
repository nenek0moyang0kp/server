import axios from 'axios';

const API_URL = 'http://localhost:3001/products';

export const fetchProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const saveProduct = async (product) => {
  // Jika tidak ada ID, tambahkan ID baru
  if (!product.id) {
    product.id = Date.now().toString();
  }

  // Ambil data lama dari server
  const { data: products } = await axios.get(API_URL);

  // Cek apakah produk sudah ada (edit atau tambah baru)
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }

  // Kirim data baru ke server (replace all)
  await axios.post(API_URL, products); // Server menerima seluruh array
};

export const deleteProduct = async (id) => {
  const { data: products } = await axios.get(API_URL);
  const updated = products.filter((p) => p.id !== id);
  await axios.post(API_URL, updated); // Kirim seluruh array yang baru
};
