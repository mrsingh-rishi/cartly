import type { Metadata } from "next";
import { Header } from "../components/Header";
import "./globals.css";
export const metadata: Metadata = { title: "Cartly — Premium Ecommerce", description: "Thoughtfully curated goods." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><Header />{children}</body></html>; }
