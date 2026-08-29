import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Personal OS", description: "A personal learning and productivity system." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
