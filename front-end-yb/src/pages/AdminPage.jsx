import React, { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import { fetchProducts, deleteProduct } from "../services/product.service";
import NavbarPage from "./navbar";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // Untuk menyimpan produk yang sedang diedit
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Menampilkan pop-up untuk menambah produk

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginTime = parseInt(localStorage.getItem("loginTime"), 10);
    const now = Date.now();

    if (loggedIn && loginTime) {
      const elapsed = now - loginTime;
      const timeout = 5 * 60 * 1000;

      if (elapsed > timeout) {
        handleLogout();
        return;
      }

      setIsLoggedIn(true);
      loadProducts();

      const remainingTime = timeout - elapsed;
      const timer = setTimeout(() => {
        handleLogout();
        alert("Sesi telah habis. Silakan login kembali.");
      }, remainingTime);
      setLogoutTimer(timer);
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, []);

  const loadProducts = () => {
    fetchProducts().then(setProducts);
  };

  const handleSave = () => {
    setEditingProduct(null); // Reset editing product
    loadProducts();
    setShowPopup(false); // Menutup pop-up setelah disimpan
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirmDelete) return;
    deleteProduct(id).then(loadProducts);
  };

  const handleEdit = (product) => {
    setEditingProduct(product); // Mengatur produk yang akan diedit
    setShowPopup(true); // Menampilkan pop-up untuk edit produk
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loginTime", Date.now());
      setIsLoggedIn(true);
      loadProducts();

      const timer = setTimeout(() => {
        handleLogout();
        alert("Sesi telah habis. Silakan login kembali.");
      }, 5 * 60 * 1000);
      setLogoutTimer(timer);
    } else {
      alert("Password salah!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginTime");
    if (logoutTimer) clearTimeout(logoutTimer);
    setIsLoggedIn(false);
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-spartan">
        <form
          onSubmit={handleLogin}
          className="bg-[#111] p-6 rounded-2xl shadow w-full max-w-sm"
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
            className="w-full bg-zinc-700 hover:bg-zinc-800 text-[#639f4e] font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-spartan pb-10">
      <NavbarPage />
      <div className="pt-20 px-6 relative max-w-7xl mx-auto">
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 font-semibold hover:underline"
          >
            Logout
          </button>
        </div>
  
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p className="text-center col-span-full text-gray-400">
              Belum ada data ditambahkan.
            </p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-[#1e1e1e] rounded-2xl shadow p-4 flex flex-col border border-gray-800"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-contain rounded mb-3 bg-black"
                />
                <h2 className="text-lg font-bold text-yellow-400 font-fustat">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-400 mb-3 font-spartan">
                  {product.description}
                </p>
                <div className="flex justify-between mt-auto">
                  <button
                    className="text-blue-400 font-semibold hover:underline"
                    onClick={() => {
                      setEditingProduct(product);
                      setShowPopup(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 font-semibold hover:underline"
                    onClick={() => handleDelete(product.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
  
        {/* Floating Button */}
        <button
          onClick={() => {
            setEditingProduct(null); // penting biar tambah data nggak nyangkut
            setShowPopup(true);
          }}
          className="fixed bottom-10 right-10 bg-[#639f4e] text-white p-4 rounded-full shadow-lg hover:bg-[#4a7d3b] transition-all duration-200 flex items-center justify-center"
        >
          <span className="text-2xl font-bold">+</span>
        </button>
  
        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-xl text-white font-spartan max-w-xl w-full relative">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? "Edit Data" : "Tambah Data"}
              </h2>
              <ProductForm
                editingProduct={editingProduct}
                onSave={() => {
                  setShowPopup(false);
                  setEditingProduct(null);
                  loadProducts();
                }}
                onCancelEdit={() => {
                  setShowPopup(false);
                  setEditingProduct(null);
                }}
              />
              <button
                onClick={() => {
                  setShowPopup(false);
                  setEditingProduct(null);
                }}
                className="mt-4 w-full bg-zinc-700 hover:bg-zinc-800 text-[#639f4e] font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Kembali
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default AdminPage;
