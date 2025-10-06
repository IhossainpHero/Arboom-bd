"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminProductPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    offerPrice: "",
    imageURL: "",
    regularPrice: "",
    details: "",
    imageID: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("পণ্য লোড করতে সমস্যা হয়েছে।");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("পণ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।");
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error("Error deleting product: ", err);
      setError("পণ্য মুছে ফেলতে ব্যর্থ হয়েছে।");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.offerPrice ||
      !newProduct.imageURL ||
      !newProduct.regularPrice ||
      !newProduct.details ||
      !newProduct.imageID
    ) {
      setError("দয়া করে সকল তথ্য পূরণ করুন।");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          offerPrice: parseFloat(newProduct.offerPrice),
          regularPrice: parseFloat(newProduct.regularPrice),
        }),
      });
      if (!res.ok) throw new Error("পণ্য যোগ করতে ব্যর্থ হয়েছে।");
      setNewProduct({
        name: "",
        offerPrice: "",
        imageURL: "",
        regularPrice: "",
        details: "",
        imageID: "",
      });
      setError(null);
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error("Error adding product: ", err);
      setError("পণ্য যোগ করতে ব্যর্থ হয়েছে।");
    }
  };

  // Cloudinary image upload handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "tatpolli"
    );

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Cloudinary আপলোডে সমস্যা হয়েছে।");
      }

      const data = await res.json();
      setNewProduct((prev) => ({
        ...prev,
        imageURL: data.secure_url,
        imageID: data.public_id,
      }));
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setUploadError("ছবি আপলোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 rounded-lg shadow-xl bg-white text-center">
          <p className="text-gray-700">পণ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">অ্যাডমিন প্যানেল</h1>
          <p className="text-gray-500 mt-2">
            নতুন পণ্য যোগ করুন এবং বিদ্যমান পণ্য পরিচালনা করুন।
          </p>
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            &larr; ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 text-green-500"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 4a1 1 0 0 0-1 1v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2h-6V5a1 1 0 0 0-1-1z" />
            </svg>{" "}
            নতুন পণ্য যোগ করুন
          </h2>
          <form
            onSubmit={handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <input
              type="text"
              placeholder="পণ্যের নাম"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="পণ্যের বিস্তারিত"
              value={newProduct.details}
              onChange={(e) =>
                setNewProduct({ ...newProduct, details: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="মূল্য (৳)"
              value={newProduct.offerPrice}
              onChange={(e) =>
                setNewProduct({ ...newProduct, offerPrice: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="সাধারণ মূল্য (৳)"
              value={newProduct.regularPrice}
              onChange={(e) =>
                setNewProduct({ ...newProduct, regularPrice: e.target.value })
              }
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Cloudinary Image Upload Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                পণ্য ছবি আপলোড করুন
              </label>
              <input
                type="file"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="mt-2 text-blue-500">ছবি আপলোড হচ্ছে...</p>
              )}
              {uploadError && (
                <p className="mt-2 text-red-500">{uploadError}</p>
              )}
              {newProduct.imageURL && (
                <div className="mt-4 flex items-center space-x-4">
                  <img
                    src={newProduct.imageURL}
                    alt="Uploaded product preview"
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-gray-500">আপলোড সফল!</p>
                    <p className="text-xs text-gray-400 break-all">
                      {newProduct.imageID}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="md:col-span-3 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              পণ্য যোগ করুন
            </button>
          </form>
        </div>

        {/* All Products Section */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            সকল পণ্য ({products.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded-xl flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition"
              >
                <div className="relative w-full h-40 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={product.imageURL}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">৳{product.offerPrice}</p>
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="p-3 text-red-500 hover:text-red-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm4-11h-8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
