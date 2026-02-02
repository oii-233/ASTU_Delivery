"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Do NOT auto-authenticate on mount. Show Login/Register immediately.
    // Listen for `roleChange` or storage updates to set role after explicit login/register.
    const readRole = () => {
      const raw = localStorage.getItem("role");
      const normalized =
        !raw || raw === "null" || raw === "undefined" || raw.trim() === ""
          ? null
          : raw;
      setRole(normalized);
    };

    setMounted(true);
    const onRoleChange = () => readRole();
    window.addEventListener("roleChange", onRoleChange);
    window.addEventListener("storage", onRoleChange);
    return () => {
      window.removeEventListener("roleChange", onRoleChange);
      window.removeEventListener("storage", onRoleChange);
    };
  }, []);

  if (!mounted) return null;

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link href="/" className="font-bold">Home</Link>

      <div className="space-x-4">
        {!role && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {role === "admin" && (
          <Link href="/admin/dashboard">Admin</Link>
        )}

        {role && (
          <button
            onClick={() => {
              localStorage.removeItem("role");
              window.dispatchEvent(new Event("roleChange"));
              router.push("/");
            }}
            className="text-red-500"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
