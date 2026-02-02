"use client";
import { IProduct } from "../../../types/product";
import { useState } from "react";

export default function AdminProductCard({ product, refresh }: { product: IProduct; refresh: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [basePrice, setBasePrice] = useState(product.basePrice);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");

  const handleUpdate = async () => {
    const token = ""; // JWT will be sent automatically via HTTP-only cookie
    try {
      const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, basePrice, imageUrl }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Update failed");
      setEditing(false);
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border rounded p-4 shadow bg-white">
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded mb-2" />
          <input
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            placeholder="Image URL"
          />
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />}
          <h2 className="font-bold text-lg">{product.name}</h2>
          <p>Base Price: ${product.basePrice}</p>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(true)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Edit
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
