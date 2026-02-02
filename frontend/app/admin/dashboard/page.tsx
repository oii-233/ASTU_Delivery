"use client";
import { useEffect, useState } from "react";
import { IProduct } from "../../../types/product";
import { fetchProducts } from "../../../utils/api";
import AdminProductCard from "./AdminProductCard";
import AddProductDialog from "../../components/AddProductDialog";

export default function AdminDashboard() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const [role, setRole] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const readRole = () => {
      const raw = localStorage.getItem("role");
      const normalized = !raw || raw === "null" || raw === "undefined" || raw.trim() === "" ? null : raw;
      setRole(normalized);
    };
    readRole();
    const onRoleChange = () => readRole();
    window.addEventListener("roleChange", onRoleChange);
    window.addEventListener("storage", onRoleChange);
    return () => {
      window.removeEventListener("roleChange", onRoleChange);
      window.removeEventListener("storage", onRoleChange);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {role === "admin" && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4 flex justify-end">
              <button onClick={() => setShowDialog(true)} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">Add Product</button>
            </div>
          )}
          {products.map((p) => (
            <AdminProductCard key={p._id} product={p} refresh={loadProducts} />
          ))}
        </div>
      )}
      {showDialog && (
        <AddProductDialog
          onClose={() => setShowDialog(false)}
          onCreated={(data) => {
            setProducts(data);
            setShowDialog(false);
          }}
        />
      )}
    </div>
  );
}
