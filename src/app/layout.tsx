import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yousef Owili",
  description: "Full-stack developer passionate about creating beautiful, functional web experiences.",
  keywords: ["developer", "portfolio", "web development", "full-stack", "Yousef Owili"],
  authors: [{ name: "Yousef Owili" }],
  creator: "Yousef Owili",
  icons: {
    icon: [
      {
        url: "/images/projects/logo-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/projects/personal-logo.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head />
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
