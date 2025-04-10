import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import { fetchProducts, deleteProduct } from "../services/product.service";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    if (loggedIn) loadProducts();
  }, []);

  const loadProducts = () => {
    fetchProducts().then(setProducts);
  };

  const handleSave = () => {
    setEditingProduct(null);
    loadProducts();
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmDelete) return;

    deleteProduct(id).then(loadProducts);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      loadProducts();
    } else {
      alert("Password salah!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-4">
        <form
          onSubmit={handleLogin}
          className="bg-[#222] p-6 rounded-2xl shadow w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Login Admin</h2>
          <input
            type="password"
            placeholder="Masukkan password"
            className="w-full p-2 border rounded bg-black text-white border-gray-600 mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black p-2 rounded-2xl font-semibold hover:bg-yellow-400"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white p-6 relative">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="absolute top-6 right-6 text-sm text-red-400 hover:underline"
      >
        Logout
      </button>

      <ProductForm
        onSave={handleSave}
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <p className="text-center col-span-full text-gray-400">
            Belum ada data ditambahkan.
          </p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-[#1e1e1e] rounded-2xl shadow p-4 flex flex-col">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain rounded mb-3 bg-black"
              />
              <h2 className="text-lg font-bold text-yellow-400">{product.title}</h2>
              <p className="text-sm text-gray-400 mb-3">{product.description}</p>
              <div className="flex justify-between mt-auto">
                <button
                  className="text-blue-400 font-semibold hover:underline"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="text-red-400 font-semibold hover:underline"
                  onClick={() => handleDelete(product.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPage;
