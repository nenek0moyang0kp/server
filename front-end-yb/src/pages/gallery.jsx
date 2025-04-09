// GalleryPage.js
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/product.service";
import Masonry from "../components/Layouts/Masonry";
import NavbarPage from "./navbar";

const GalleryPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log("Fetched data:", data); // Tambahkan ini
  
        if (!Array.isArray(data)) {
          console.error("Data bukan array, tapi:", data);
          setProducts([]); // biar aman
          return;
        }
  
        const formattedData = data.map((item) => ({
          ...item,
          height: 1,
          likes: item.likes || Math.floor(Math.random() * 1000),
          comments: item.comments || Math.floor(Math.random() * 100),
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
  
    getProducts();
  }, []);
  

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "auto";
  }, [selectedPost]);

  const closePopup = () => setSelectedPost(null);

  return (
    <div className="min-h-screen bg-black text-white px-2 sm:px-4">
      <NavbarPage />

      <div className="text-center py-8 sm:py-12 mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Instagram Feed</h1>
        <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto px-4">
          Our latest posts - Click to view details
        </p>
      </div>

      <div className="container mx-auto px-0 sm:px-4 py-4">
        {products.length > 0 ? (
          <Masonry
            data={products}
            onClick={setSelectedPost}
            className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          />
        ) : (
          <div className="text-center py-20 animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Responsive Popup */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-lg max-w-2xl w-full md:max-w-4xl">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 md:top-4 md:right-4 z-50 p-2 bg-gray-900 rounded-full hover:bg-gray-800 transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
              {/* Image Section */}
              <div className="flex-1 min-w-0">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title || "Post"}
                  className="w-full h-auto max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto max-h-[70vh] md:max-h-[80vh] pr-2">
                {selectedPost.title && (
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {selectedPost.title}
                  </h2>
                )}

                <div className="mb-6">
                  <p className="text-gray-300 whitespace-pre-line">
                    {selectedPost.description}
                  </p>
                </div>

                <a
                  href={`https://instagram.com/p/${selectedPost.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full flex items-center justify-center hover:opacity-90 transition mt-auto"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.281-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Open on Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
