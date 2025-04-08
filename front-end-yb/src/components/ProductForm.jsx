import React, { useEffect, useState } from "react";
import { uploadToImgur } from "../services/imgur.service";
import { updateProductsFile } from "../services/github.service";

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
    if (file) {
      try {
        const imageUrl = await uploadToImgur(file);
        setProduct((prev) => ({ ...prev, image: imageUrl }));
        console.log("Gambar berhasil diupload ke:", imageUrl);
      } catch (err) {
        console.error("Gagal upload gambar:", err.message);
        alert("Upload gambar gagal. Coba lagi!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.title || !product.description || !product.image) {
      alert("Semua field wajib diisi!");
      return;
    }

    const productToSave = {
      ...product,
      id: product.id || Date.now().toString(),
    };

    try {
      const productsRes = await fetch("https://raw.githubusercontent.com/calioralam/YBStudio/main/products.json");
      const existingProducts = await productsRes.json();

      const updatedProducts = product.id
        ? existingProducts.map((p) => (p.id === product.id ? productToSave : p))
        : [...existingProducts, productToSave];

      await updateProductsFile(updatedProducts);
      alert("Produk berhasil disimpan ke GitHub!");

      onSave?.(productToSave);
      setProduct({ title: "", description: "", image: "", id: null });

    } catch (err) {
      console.error("Gagal menyimpan ke GitHub:", err.message);
      alert("Gagal menyimpan produk. Coba lagi!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-xl shadow-lg text-white"
    >
      <h2 className="text-xl font-semibold mb-4">
        {product.id ? "Edit Produk" : "Tambah"}
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
