import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { resetStore } from "./domain/ecommerce.service.js";

const app = createApp();
const add = (productId = "1", quantity = 1) => request(app).post("/api/cart/items").send({ productId, quantity });
const checkout = (couponCode?: string) => request(app).post("/api/checkout").send(couponCode ? { couponCode } : {});
const placeOrders = async (count: number) => { for (let i = 0; i < count; i++) { await add(); await checkout(); } };
const adminPost = (path: string) => request(app).post(path).set("x-admin-key", "dev-admin-key");
const adminGet = (path: string) => request(app).get(path).set("x-admin-key", "dev-admin-key");

beforeEach(resetStore);

describe("Cartly API", () => {
  it("returns health", async () => expect((await request(app).get("/api/health")).body).toEqual({ ok: true, service: "cartly-api" }));
  it("returns six products", async () => expect((await request(app).get("/api/products")).body.products).toHaveLength(6));
  it("starts with an empty cart", async () => expect((await request(app).get("/api/cart")).body.summary.itemCount).toBe(0));
  it("adds an item", async () => expect((await add()).body.cart.summary.itemCount).toBe(1));
  it("increments an existing item", async () => { await add(); expect((await add()).body.cart.items[0].quantity).toBe(2); });
  it("rejects an invalid product", async () => expect((await add("missing")).body.error.code).toBe("PRODUCT_NOT_FOUND"));
  it("updates quantity", async () => { await add(); expect((await request(app).patch("/api/cart/items/1").send({ quantity: 4 })).body.cart.items[0].quantity).toBe(4); });
  it("rejects quantity below one", async () => { await add(); expect((await request(app).patch("/api/cart/items/1").send({ quantity: 0 })).body.error.code).toBe("VALIDATION_ERROR"); });
  it("removes an item", async () => { await add(); expect((await request(app).delete("/api/cart/items/1")).body.cart.items).toHaveLength(0); });
  it("rejects empty checkout", async () => expect((await checkout()).body.error.code).toBe("EMPTY_CART"));
  it("checks out without coupon", async () => { await add(); expect((await checkout()).status).toBe(201); });
  it("creates an order and clears cart", async () => { await add(); const order = (await checkout()).body.order; expect(order.id).toBe("ORD-0001"); expect((await request(app).get("/api/cart")).body.items).toHaveLength(0); });
  it("charges shipping below threshold", async () => { await add("3"); expect((await checkout()).body.order.shippingCents).toBe(799); });
  it("provides free shipping at threshold", async () => { await add("2"); expect((await checkout()).body.order.shippingCents).toBe(0); });
  it("blocks coupon generation before three orders", async () => expect((await adminPost("/api/admin/discount-codes")).body.error.code).toBe("COUPON_NOT_ELIGIBLE"));
  it("generates a coupon after three orders", async () => { await placeOrders(3); expect((await adminPost("/api/admin/discount-codes")).body.coupon.discountPercent).toBe(10); });
  it("blocks duplicate generation for a milestone", async () => { await placeOrders(3); await adminPost("/api/admin/discount-codes"); expect((await adminPost("/api/admin/discount-codes")).body.error.code).toBe("COUPON_ALREADY_GENERATED_FOR_MILESTONE"); });
  it("applies a generated coupon", async () => { await placeOrders(3); const code = (await adminPost("/api/admin/discount-codes")).body.coupon.code; await add(); expect((await checkout(code)).body.order.discountCents).toBe(500); });
  it("prevents coupon reuse", async () => { await placeOrders(3); const code = (await adminPost("/api/admin/discount-codes")).body.coupon.code; await add(); await checkout(code); await add(); expect((await checkout(code)).body.error.code).toBe("COUPON_ALREADY_USED"); });
  it("rejects invalid coupons", async () => { await add(); expect((await checkout("NOPE")).body.error.code).toBe("INVALID_COUPON"); });
  it("reports order and item stats", async () => { await add("1", 2); await checkout(); const stats = (await adminGet("/api/admin/stats")).body.stats; expect(stats.totalOrders).toBe(1); expect(stats.totalItemsPurchased).toBe(2); });
  it("reports actual revenue", async () => { await add("1"); await checkout(); expect((await adminGet("/api/admin/stats")).body.stats.totalRevenueCents).toBe(5798); });
  it("reports generated codes and discounts given", async () => { await placeOrders(3); const code = (await adminPost("/api/admin/discount-codes")).body.coupon.code; await add(); await checkout(code); const stats = (await adminGet("/api/admin/stats")).body.stats; expect(stats.discountCodesGenerated).toBe(1); expect(stats.totalDiscountsGivenCents).toBe(500); });

  // BUG 2 — missing Content-Type header returns a clear error
  it("returns MISSING_BODY when Content-Type header is absent", async () => {
    const res = await request(app).post("/api/cart/items").set("Content-Type", "text/plain").send("bad");
    expect(res.body.error.code).toBe("MISSING_BODY");
  });

  // BUG 3 — quantity upper-bound enforcement
  it("rejects add quantity above max", async () => expect((await add("1", 100)).body.error.code).toBe("VALIDATION_ERROR"));
  it("rejects accumulated quantity above max via service", async () => {
    await add("1", 50);
    expect((await add("1", 50)).body.error.code).toBe("QUANTITY_EXCEEDED");
  });

  // BUG 7 — admin routes require API key
  it("blocks admin stats without API key", async () => expect((await request(app).get("/api/admin/stats")).status).toBe(401));
  it("blocks discount code generation without API key", async () => expect((await request(app).post("/api/admin/discount-codes")).status).toBe(401));
});
