"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ProductImage from "./product-image";
import { buttonVariants } from "./ui/button";
import { useCart } from "./cart-provider";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

function ProductDetailsModal({ product, onClose }) {
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    if (!product) {
      document.body.style.overflow = "";
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, product]);

  if (!product) {
    return null;
  }

  function handleAddToCart() {
    addItem(product.slug, 1);
    onClose();
  }

  function handleBuyNow() {
    addItem(product.slug, 1);
    onClose();
    router.push("/cart");
  }

  return (
    <div
      className="product-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`product-modal-title-${product.slug}`}
        className="product-modal-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="btn btn-circle btn-sm btn-ghost product-modal-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          x
        </button>

        <div className="product-modal-layout">
          <div className="product-modal-image">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain p-4"
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3
                id={`product-modal-title-${product.slug}`}
                className="text-3xl font-bold text-primary"
              >
                {product.name}
              </h3>
              <Badge variant="outline" className="text-sm">
                {product.price}
              </Badge>
            </div>

            <p className="body-copy">{product.description}</p>

            <section className="detail-copy-block">
              <h4 className="detail-section-title">Ingredients and allergens</h4>
              <p className="detail-section-copy">{product.ingredientsAllergens}</p>
            </section>

            {product.recipeIdea ? (
              <section className="detail-copy-block">
                <h4 className="detail-section-title">Recipe idea</h4>
                <p className="detail-section-copy">{product.recipeIdea}</p>
              </section>
            ) : null}

            <section className="grid gap-4 md:grid-cols-2">
              <div className="feature-card">
                <h4 className="feature-title">Nutrition per 100g</h4>
                <p className="feature-copy">{product.nutritionPer100g}</p>
              </div>
              <div className="feature-card">
                <h4 className="feature-title">Serves</h4>
                <p className="feature-copy">{product.serves}</p>
              </div>
            </section>

            <section className="detail-copy-block">
              <h4 className="detail-section-title">Storage</h4>
              <p className="detail-section-copy">{product.storage}</p>
            </section>

            {product.note ? (
              <section className="detail-copy-block">
                <h4 className="detail-section-title">Note</h4>
                <p className="detail-section-copy">{product.note}</p>
              </section>
            ) : null}

            <div className="product-modal-actions">
              <button
                type="button"
                className={buttonVariants({ variant: "outline", size: "default" })}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
              <button
                type="button"
                className={buttonVariants({ variant: "default", size: "default" })}
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopProductGrid({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <div className="product-list-grid">
        {products.map((product) => (
          <button
            key={product.slug}
            type="button"
            className="product-card-button"
            onClick={() => setSelectedProduct(product)}
            aria-label={`Open ${product.name} product details`}
          >
            <Card className="product-list-card">
              <CardContent className="p-4">
                <div className="product-list-image">
                  <ProductImage
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain p-3"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">{product.name}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {product.shortDescription}
                </p>
                <p className="mt-3 font-semibold text-foreground">{product.price}</p>
                <span
                  className={`${buttonVariants({ variant: "default", size: "sm" })} product-card-cta mt-4`}
                >
                  View Product
                </span>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
