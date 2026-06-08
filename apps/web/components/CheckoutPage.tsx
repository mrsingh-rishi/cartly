"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CartItem } from "@cartly/shared";
import { api } from "../lib/api";
import { money } from "../lib/money";

type Data = { items: (CartItem & { lineTotalCents: number })[]; summary: { subtotalCents: number; shippingCents: number; totalCents: number } };
type Preview = { discountPercent: number; estimatedDiscountCents: number };

export function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Data | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewError, setPreviewError] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { api<Data>("/api/cart").then(setCart).catch((e) => setError(e.message)); }, []);

  const handleCodeChange = (val: string) => {
    setCode(val);
    setError("");
    setPreview(null);
    setPreviewError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = val.trim();
    if (!trimmed) return;
    debounceRef.current = setTimeout(async () => {
      try {
        const result = await api<Preview>(`/api/coupons/preview?code=${encodeURIComponent(trimmed.toUpperCase())}`);
        setPreview(result);
        setPreviewError("");
      } catch (e) {
        setPreview(null);
        setPreviewError((e as Error).message);
      }
    }, 400);
  };

  const place = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api<{ order: object }>("/api/checkout", { method: "POST", body: JSON.stringify(code.trim() ? { couponCode: code.trim().toUpperCase() } : {}) });
      sessionStorage.setItem("cartly:last-order", JSON.stringify(result.order));
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/order-success");
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  };

  if (!cart) return <main className="center-state"><h2>Loading checkout…</h2><p>{error || "Preparing your order."}</p></main>;

  const displayTotal = cart.summary.totalCents - (preview?.estimatedDiscountCents ?? 0);

  return (
    <main className="page narrow">
      <Link className="back" href="/cart">← Back to Cart</Link>
      <h1>Checkout</h1>
      <div className="two-col checkout">
        <section className="stack">
          <div className="panel">
            <h3>Order Items ({cart.items.length})</h3>
            {cart.items.map((i) => (
              <div className="item-row" key={i.productId}>
                <span><b>{i.name}</b> ×{i.quantity}</span>
                <strong>{money(i.lineTotalCents)}</strong>
              </div>
            ))}
          </div>
          <div className="panel">
            <h3>Discount Coupon</h3>
            <div className="coupon-input">
              <input value={code} onChange={(e) => handleCodeChange(e.target.value)} placeholder="Enter coupon code" />
              {preview && <span className="coupon-valid">✓ {preview.discountPercent}% off applied</span>}
              {!preview && <span>Validated securely at checkout</span>}
            </div>
            {previewError && <p className="field-error">{previewError}</p>}
            {error && <p className="field-error">{error}</p>}
          </div>
        </section>
        <aside className="summary-card">
          <h3>Order Total</h3>
          <Row label="Subtotal" value={money(cart.summary.subtotalCents)} />
          <Row label="Shipping" value={cart.summary.shippingCents ? money(cart.summary.shippingCents) : "Free"} />
          {preview && <Row label={`Discount (${preview.discountPercent}% off subtotal)`} value={`-${money(preview.estimatedDiscountCents)}`} />}
          <hr />
          <Row label="Total" value={money(displayTotal)} bold />
          <button className="primary-button" disabled={loading || !cart.items.length} onClick={place}>{loading ? "Placing Order…" : "Place Order →"}</button>
          <small className="secure">Secure demo checkout · No payment required</small>
        </aside>
      </div>
    </main>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`summary-row ${bold ? "bold" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
