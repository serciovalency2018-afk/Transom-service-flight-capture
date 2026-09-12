import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRANSOM — Flight Service Capture",
  description: "TRANSOM Flight Service Capture"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
