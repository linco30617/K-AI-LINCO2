import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LINCO",
  description: "LINCO AI 비서와 정보 패널",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
