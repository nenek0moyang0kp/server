import axios from 'axios';

const API_URL = 'https://ybstudio-production.up.railway.app';

export const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/products`);
    if (!Array.isArray(res.data)) {
      console.error("❌ Expected array, got:", res.data);
      return [];
    }
    return res.data;
  } catch (error) {
    console.error("❌ Failed to fetch products:", error.message);
    return [];
  }
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await axios.post(`${API_URL}/upload`, formData);
    return res.data.imageUrl;
  } catch (error) {
    console.error("❌ Upload gagal:", error.message);
    throw error;
  }
};

export const saveProduct = async (product) => {
  try {
    if (!product.id) {
      product.id = Date.now().toString();
    }

    const { data: products } = await axios.get(`${API_URL}/products`);

    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }

    await axios.post(`${API_URL}/products`, products);
  } catch (error) {
    console.error("❌ Failed to save product:", error.message);
  }
};

export const deleteProduct = async (id) => {
  try {
    const { data: products } = await axios.get(`${API_URL}/products`);
    const updated = products.filter((p) => p.id !== id);
    await axios.post(`${API_URL}/products`, products);
  } catch (error) {
    console.error("❌ Failed to delete product:", error.message);
  }
};
