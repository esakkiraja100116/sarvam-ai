import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarvam TTS - Text to Speech",
  description: "Convert text to speech using Sarvam AI's Bulbul v3 model",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
