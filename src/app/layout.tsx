import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Yousef Owili",
  description: "Full-stack developer passionate about creating beautiful, functional web experiences.",
  keywords: ["developer", "portfolio", "web development", "full-stack", "Yousef Owili"],
  authors: [{ name: "Yousef Owili" }],
  creator: "Yousef Owili",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/images/projects/personal-logo.png" type="image/png" sizes="any" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
