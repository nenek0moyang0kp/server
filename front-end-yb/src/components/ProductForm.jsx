import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveProduct } from "../services/product.service";

const ProductForm = ({ onSave, editingProduct, onCancelEdit }) => {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    image: "",
    id: null,
  });

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("https://ybstudio-production.up.railway.app/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const imageUrl = res.data.imageUrl;
      setProduct((prev) => ({ ...prev, image: imageUrl }));
      console.log("Gambar berhasil diupload:", imageUrl);
    } catch (err) {
      console.error("Upload gagal:", err.message);
      alert("Upload gambar gagal.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.title || !product.description || !product.image) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      await saveProduct(product);
      alert("Produk berhasil disimpan!");
      setProduct({ title: "", description: "", image: "", id: null });
      onSave?.(product);
    } catch (err) {
      console.error("Gagal menyimpan produk:", err.message);
      alert("Gagal menyimpan produk.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-lg text-white"
    >
      <h2 className="text-xl font-semibold mb-4">
        {product.id ? "Edit Produk" : "Tambah Produk"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm mb-1">Judul</label>
        <input
          name="title"
          type="text"
          value={product.title}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Deskripsi</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Upload Gambar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-sm file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700"
        />
        {product.image && (
          <img
            src={product.image}
            alt="Preview"
            className="mt-4 max-h-64 object-contain rounded"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg font-semibold"
        >
          {product.id ? "Update Produk" : "Simpan Produk"}
        </button>
        {product.id && (
          <button
            type="button"
            onClick={() => {
              setProduct({ title: "", description: "", image: "", id: null });
              onCancelEdit?.();
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-semibold"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
