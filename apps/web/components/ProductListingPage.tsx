"use client";
import { useEffect, useState } from "react";
import type { Product } from "@cartly/shared";
import { api } from "../lib/api";
import { money } from "../lib/money";
import { ProductPlaceholder } from "./ProductPlaceholder";

export function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");
  useEffect(() => { api<{ products: Product[] }>("/api/products").then((x) => setProducts(x.products)).catch((e) => setError(e.message)); }, []);
  const add = async (id: string) => {
    await api("/api/cart/items", { method: "POST", body: JSON.stringify({ productId: id, quantity: 1 }) });
    setAdded(id); window.dispatchEvent(new Event("cart-updated")); setTimeout(() => setAdded(""), 1400);
  };
  return <main><section className="hero"><p>Free shipping on orders over $75</p><h1>Thoughtfully<br />curated goods.</h1><h2>Premium products, minimal packaging, built to last a lifetime.</h2><button className="dark-button" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>Browse collection →</button></section>
    <div className="rule" /><section id="products" className="products-section"><div className="section-title"><h2>All Products</h2><span>{products.length} items</span></div>
      {error && <div className="error-banner">{error}</div>} {!products.length && !error && <div className="empty-inline">Loading collection…</div>}
      <div className="product-grid">{products.map((product) => <article className="product-card" key={product.id}><ProductPlaceholder product={product} /><div className="product-copy"><small>{product.category}</small><h3>{product.name}</h3><p>{product.desc}</p><footer><strong>{money(product.priceCents)}</strong><button onClick={() => add(product.id)} className={added === product.id ? "success" : ""}>{added === product.id ? "✓ Added" : "+ Add to Cart"}</button></footer></div></article>)}</div>
    </section></main>;
}

