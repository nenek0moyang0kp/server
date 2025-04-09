import axios from 'axios';

const API_URL = 'https://ybstudio-production.up.railway.app';

export const fetchProducts = async () => {
  const res = await axios.get("https://ybstudio-production.up.railway.app/");
  if (!Array.isArray(res.data)) {
    console.error("Expected array, got:", res.data);
    return [];
  }
  return res.data;
};



export const saveProduct = async (product) => {
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

  await axios.post(API_URL, products);
};

export const deleteProduct = async (id) => {
  const { data: products } = await axios.get(`${API_URL}/products`);
  const updated = products.filter((p) => p.id !== id);
  await axios.post(`${API_URL}/products`, updated);
};
