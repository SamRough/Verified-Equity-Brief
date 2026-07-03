import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Equity Research Copilot",
  description: "Source-verifiable AI research brief for public equities",
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
