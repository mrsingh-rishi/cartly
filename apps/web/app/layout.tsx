import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Header } from "../components/Header";
import "./globals.css";
const dm = DM_Sans({ subsets: ["latin"] });
export const metadata: Metadata = { title: "Cartly — Premium Ecommerce", description: "Thoughtfully curated goods." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={dm.className}><Header />{children}</body></html>; }

