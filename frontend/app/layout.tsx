import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Delivery App",
  description: "Full-stack delivery app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
