"use client";
import { useEffect, useState } from "react";
import { IProduct } from "../types/product";
import { fetchProducts } from "../utils/api";
import ProductCard from "./components/ProductCard";
import AddProductDialog from "./components/AddProductDialog";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const readRole = () => {
      const raw = localStorage.getItem("role");
      const normalized =
        !raw || raw === "null" || raw === "undefined" || raw.trim() === ""
          ? null
          : raw;
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

  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      {!role && (
        <header className="w-full mb-6">
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded overflow-hidden shadow">
            <img src="/hero.jpg" alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <h1 className="
                text-3xl md:text-4xl lg:text-6xl
                font-extrabold tracking-tight
                bg-gradient-to-r from-blue-200 via-slate-300 to-fuchsia-50
                bg-clip-text text-transparent
                drop-shadow-[0_4px_20px_rgba(168,85,247,0.5)]
              ">
                Welcome to ASTU Delivery App
              </h1>

            </div>
          </div>
        </header>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {role === "admin" && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4 flex justify-end">
            <div>
              <button onClick={() => setShowDialog(true)} className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                Add Product
              </button>
            </div>
          </div>
        )}
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
      {showDialog && (
        <AddProductDialog
          onClose={() => setShowDialog(false)}
          onCreated={(data) => {
            setProducts(data);
          }}
        />
      )}
    </>
  );
}
