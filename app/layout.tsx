import "./globals.css";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Marley Coffee - Soul of Jamaica, Spirit of Coffee",
  description: "Premium organic, fair trade coffee from Jamaica. Founded by Rohan Marley in honor of Bob Marley's legacy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={`${inter.className} ${playfair.variable}`}>{children}</body>
    </html>
  );
}