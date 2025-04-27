import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
              <a href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                AI Companion
              </a>
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <a
                      href="/"
                      className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      Home
                    </a>
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