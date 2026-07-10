import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verified Equity Brief",
  description: "Source-verifiable news intelligence for public equities",
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
