import { CATEGORY_CONFIG, type Product } from "@cartly/shared";

export function ProductPlaceholder({ product, mini = false }: { product: Pick<Product, "id" | "category">; mini?: boolean }) {
  const cfg = CATEGORY_CONFIG[product.category as keyof typeof CATEGORY_CONFIG] ?? CATEGORY_CONFIG.Apparel;
  return <div className={mini ? "placeholder mini" : "placeholder"} style={{ backgroundColor: cfg.bg, color: cfg.text, backgroundImage: `repeating-linear-gradient(45deg, transparent 0 7px, ${cfg.stripe} 7px 9px)` }}>
    <span>{mini ? product.category.slice(0, 4).toUpperCase() : product.category.toUpperCase()}<br />{mini ? "SHOT" : "PRODUCT SHOT"}</span>
  </div>;
}

