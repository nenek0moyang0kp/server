import React, { useEffect, useState } from "react";
import { saveProduct } from "../services/product.service";
import { uploadImageToImgur } from "../services/imgur.service";

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

    try {
      const imageUrl = await uploadImageToImgur(file);
      setProduct((prev) => ({ ...prev, image: imageUrl }));
      console.log("Gambar berhasil diupload ke Imgur:", imageUrl);
    } catch (err) {
      console.error("Upload ke Imgur gagal:", err.message);
      alert("Upload gambar ke Imgur gagal.");
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
      alert("Data berhasil disimpan!");
      setProduct({ title: "", description: "", image: "", id: null });
      onSave?.(product);
    } catch (err) {
      console.error("Gagal menyimpan data:", err.message);
      alert("Gagal menyimpan data.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-2xl shadow-xl text-white font-spartan"
    >
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">
        {product.id ? "Edit Data" : "Tambah Data"}
      </h2>

      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-300">Judul</label>
        <input
          name="title"
          type="text"
          value={product.title}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#639f4e]"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1 text-gray-300">Deskripsi</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-black border border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#639f4e]"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-2 text-gray-300">Pilih Gambar</label>
        <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full p-2 rounded-xl bg-transparent text-white border border-[#639f4e]
        file:mr-4 file:py-2 file:px-4 file:rounded-full
        file:border-0 file:bg-gray-300 file:text-black
        file:text-sm file:font-semibold hover:file:bg-gray-400 transition"
        />

        {product.image && (
          <img
            src={product.image}
            alt="Preview"
            className="mt-4 max-h-64 object-contain rounded-xl border border-gray-700"
          />
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <button
          type="submit"
          className="w-full bg-transparent border border-[#639f4e] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#639f4e]/10 transition"
        >
          {product.id ? "Update Data" : "SUBMIT"}
        </button>

        {product.id && (
          <button
            type="button"
            onClick={() => {
              setProduct({ title: "", description: "", image: "", id: null });
              onCancelEdit?.();
            }}
            className="w-full bg-transparent border border-gray-500 text-white py-2 px-4 rounded-xl font-semibold hover:bg-white/10 transition"
          >
            Batal
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
