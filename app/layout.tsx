import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Night Market Miyazaki",
  description: "Shop form submission system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
