export const API_BASE = "http://localhost:5000/api";

export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerUser = async (name: string, email: string, password: string, role?: string) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
    credentials: "include"
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
};
