import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyberscape",
  description: "Full-stack retro computer-network game with a Windows-era workstation shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 antialiased">
        {children}
      </body>
    </html>
  );
}
