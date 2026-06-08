"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function Header() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const refresh = () => api<{ summary: { itemCount: number } }>("/api/cart").then((x) => setCount(x.summary.itemCount)).catch(() => {});
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);
  return <header className="site-header"><div className="header-inner">
    <Link className="logo" href="/"><span className="logo-mark">◆</span><strong>Cartly</strong></Link>
    <nav><Link href="/">Shop</Link><span>·</span><Link href="/admin">Admin</Link><i /><Link className="cart-link" href="/cart" aria-label="Cart">🛒{count > 0 && <b>{count > 9 ? "9+" : count}</b>}</Link></nav>
  </div></header>;
}

