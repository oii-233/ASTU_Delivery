"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IProduct } from "../../../types/product";
import { API_BASE } from "../../../utils/api";

export default function ProductDetail() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_BASE}/products/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || "Error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
      <div className="mb-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="w-full h-80 object-cover rounded mb-4" />
      )}
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="mb-4">Base Price: ${product.basePrice}</p>

      <h2 className="font-semibold mb-2">Distance Prices</h2>
      <ul className="mb-4">
        {product.distancePrices && product.distancePrices.length > 0 ? (
          product.distancePrices.map((d) => (
            <li key={d.town} className="mb-1">
              {d.town}: ${d.price}
            </li>
          ))
        ) : (
          <li>No distance-specific prices.</li>
        )}
      </ul>

      <p className="text-sm text-gray-500">Created by: {product.createdBy}</p>
      <p className="text-sm text-gray-500">Created at: {new Date(product.createdAt).toLocaleString()}</p>
    </div>
  );
}
