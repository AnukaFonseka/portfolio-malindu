import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Malindu — Concept Artist",
  description:
    "Portfolio of Malindu, a concept artist specializing in environment design and character concept art.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Brandon Grotesque */}
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/brandon-grotesque"
        />
        {/* Europa */}
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/europa-2"
        />
      </head>
      <body className="min-h-screen bg-[#0c0c0c] text-[#ede8e0] md:mx-7 2xl:mx-16">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
