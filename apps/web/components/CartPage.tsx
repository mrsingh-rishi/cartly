"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CartItem } from "@cartly/shared";
import { api } from "../lib/api";
import { money } from "../lib/money";
import { ProductPlaceholder } from "./ProductPlaceholder";

type CartData = { items: (CartItem & { lineTotalCents: number })[]; summary: { itemCount: number; subtotalCents: number; shippingCents: number; totalCents: number } };
export function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null); const [error, setError] = useState("");
  const load = () => api<CartData>("/api/cart").then(setCart).catch((e) => setError(e.message));
  useEffect(() => { void load(); }, []);
  const mutate = async (path: string, method: string, body?: object) => { const result = await api<{ cart: CartData }>(path, { method, body: body ? JSON.stringify(body) : undefined }); setCart(result.cart); window.dispatchEvent(new Event("cart-updated")); };
  if (error) return <State title="Could not load cart" text={error} />;
  if (!cart) return <State title="Loading cart…" text="Fetching your selected goods." />;
  if (!cart.items.length) return <State title="Your cart is empty" text="Looks like you haven't added anything yet." />;
  return <main className="page"><Link className="back" href="/">← Continue shopping</Link><h1>Your Cart <em>({cart.summary.itemCount} items)</em></h1><div className="two-col"><section className="stack">{cart.items.map((item) => <article className="cart-item" key={item.productId}><ProductPlaceholder product={{ id: item.productId, category: item.category }} mini /><div className="grow"><strong>{item.name}</strong><small>{item.category}</small><b>{money(item.priceCents)}</b></div><div className="qty"><button onClick={() => item.quantity > 1 && mutate(`/api/cart/items/${item.productId}`, "PATCH", { quantity: item.quantity - 1 })}>−</button><span>{item.quantity}</span><button onClick={() => mutate(`/api/cart/items/${item.productId}`, "PATCH", { quantity: item.quantity + 1 })}>+</button></div><button className="trash" onClick={() => mutate(`/api/cart/items/${item.productId}`, "DELETE")}>×</button></article>)}</section><Summary cart={cart} /></div></main>;
}
function Summary({ cart }: { cart: CartData }) { return <aside className="summary-card"><h3>Order Summary</h3><Row label={`Subtotal (${cart.summary.itemCount} items)`} value={money(cart.summary.subtotalCents)} /><Row label="Shipping" value={cart.summary.shippingCents ? money(cart.summary.shippingCents) : "Free"} green={!cart.summary.shippingCents} />{cart.summary.shippingCents > 0 && <p className="shipping-note">Add <b>{money(7500 - cart.summary.subtotalCents)}</b> more for free shipping</p>}<hr /><Row label="Total" value={money(cart.summary.totalCents)} bold /><Link className="primary-button" href="/checkout">Proceed to Checkout →</Link><Link className="secondary-button" href="/">Continue Shopping</Link></aside>; }
function Row({ label, value, bold, green }: { label: string; value: string; bold?: boolean; green?: boolean }) { return <div className={`summary-row ${bold ? "bold" : ""} ${green ? "green" : ""}`}><span>{label}</span><span>{value}</span></div>; }
function State({ title, text }: { title: string; text: string }) { return <main className="center-state"><div className="state-icon">🛒</div><h2>{title}</h2><p>{text}</p><Link className="primary-button compact" href="/">Browse Products</Link></main>; }
