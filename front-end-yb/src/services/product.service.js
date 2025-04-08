export const fetchProducts = () => {
  const products = JSON.parse(localStorage.getItem("products") || "[]");
  return Promise.resolve(products);
};

export const saveProduct = (product) => {
  const products = JSON.parse(localStorage.getItem("products") || []);
  if (product.id) {
    const index = products.findIndex((p) => p.id === product.id);
    products[index] = product;
  } else {
    product.id = Date.now().toString();
    products.push(product);
  }
  localStorage.setItem("products", JSON.stringify(products));
  return Promise.resolve();
};

export const deleteProduct = (id) => {
  const products = JSON.parse(localStorage.getItem("products") || []);
  const updated = products.filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(updated));
  return Promise.resolve();
};