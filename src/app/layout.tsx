import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SearchBox — Interactive Keyboard Search",
  description: "A premium glassmorphism search experience with an interactive sound-enabled keyboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: "#050505" }}>
        {children}
      </body>
    </html>
  );
}
