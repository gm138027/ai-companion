import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link"; // 添加这一行
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Companion - Chat with Virtual Companions",
  description: "Chat with AI companions with different personalities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                AI Companion
              </Link>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      Home
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-gray-200 bg-white py-6 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} AI Companion. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}