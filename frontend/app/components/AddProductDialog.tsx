"use client";
import { useState } from "react";
import { API_BASE, fetchProducts } from "../../utils/api";
import { IProduct } from "../../types/product";

export default function AddProductDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (products: IProduct[]) => void;
}) {
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          basePrice: Number(basePrice),
          imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await fetchProducts();
      onCreated(data);
      onClose();
    } catch {
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            type="number"
            placeholder="Base Price"
            className="w-full border p-2 rounded"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />
          <input
            placeholder="Image URL"
            className="w-full border p-2 rounded"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
