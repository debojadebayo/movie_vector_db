import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Movie Recommendation App",
  description: "See your favourite movies and movies you'd love based on recommendation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-blue-600 to-blue-900 max-w-7xl mx-auto">
        <main className="bg-slate-50/50 shadow-2xl drop-shadow-2xl">
          <Header />

          {children}
        </main>
      </body>
    </html>
  );
}
