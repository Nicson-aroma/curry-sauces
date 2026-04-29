"use client";

import Link from "next/link";

import CheckoutButton from "./checkout-button";
import { useCart } from "./cart-provider";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { products } from "../lib/meahs-data";
import { formatPenceAsPounds, priceToPence } from "../lib/pricing";

const productMap = Object.fromEntries(products.map((product) => [product.slug, product]));

export default function CartPageContent() {
  const { items, isReady, setItemQuantity, removeItem, clearCart } = useCart();

  const lineItems = items
    .map((item) => {
      const product = productMap[item.slug];

      if (!product) {
        return null;
      }

      const unitAmount = priceToPence(product.price);

      return {
        ...product,
        quantity: item.quantity,
        unitAmount,
        lineTotal: unitAmount * item.quantity,
      };
    })
    .filter(Boolean);

  const totalAmount = lineItems.reduce((total, item) => total + item.lineTotal, 0);
  const totalQuantity = lineItems.reduce((total, item) => total + item.quantity, 0);
  const meetsMinimumOrder = totalQuantity >= 6;
  const isEmpty = isReady && lineItems.length === 0;

  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">Shopping Cart</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            {isReady
              ? isEmpty
                ? "Basket empty. Add sauces from the shop to continue."
                : `You have ${lineItems.length} product type${lineItems.length > 1 ? "s" : ""} in your basket.`
              : "Loading your basket..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="feature-card feature-card-accent">
            <p className="feature-title">Order rule</p>
            <p className="feature-copy">
              We only deliver batch of 6 or 12, please adjust the cart accordingly.
            </p>
          </div>

          <div className="feature-card">
            <p className="feature-title">Delivery timing</p>
            <p className="feature-copy">
              Orders placed before 1.00pm will be delivered the next day, after
              1.00pm will be delivered within 48 hours (UK mainland only).
              Friday orders will be delivered on Tuesday.
            </p>
          </div>

          <div className="feature-card">
            <p className="feature-title">Storage</p>
            <p className="feature-copy">
              Please note this is a chilled product and should be stored under
              refrigeration upon delivery.
            </p>
          </div>

          {isReady && lineItems.length > 0 ? (
            <div className="cart-layout">
              <div className="space-y-4">
                {lineItems.map((item) => (
                  <div key={item.slug} className="cart-item-card">
                    <div>
                      <p className="text-lg font-semibold text-primary">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.shortDescription}</p>
                    </div>

                    <div className="cart-item-meta">
                      <p className="font-semibold">{item.price} each</p>
                      <div className="join">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="join-item"
                          onClick={() => setItemQuantity(item.slug, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="join-item flex min-w-14 items-center justify-center border border-base-300 bg-base-100 px-4 text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="join-item"
                          onClick={() => setItemQuantity(item.slug, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-semibold text-secondary">
                        {formatPenceAsPounds(item.lineTotal)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="justify-self-start text-error"
                      onClick={() => removeItem(item.slug)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="ghost" onClick={clearCart}>
                    Clear cart
                  </Button>
                  <Link
                    href="/shop"
                    className={buttonVariants({ variant: "outline", size: "default" })}
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>

              <div className="cart-summary-card">
                <p className="feature-title">Order Summary</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span>Total sauces</span>
                    <span className="font-semibold">{totalQuantity}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Items total</span>
                    <span className="font-semibold">{formatPenceAsPounds(totalAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Delivery</span>
                    <span className="font-semibold">Calculated in test checkout</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 border-t border-base-300 pt-3 text-base">
                    <span>Total</span>
                    <span className="font-bold text-primary">
                      {formatPenceAsPounds(totalAmount)}
                    </span>
                  </div>
                </div>

                {!meetsMinimumOrder ? (
                  <p className="mt-4 text-sm text-warning">
                    Add at least 6 sauces before going to payment.
                  </p>
                ) : null}

                <div className="mt-5">
                  <CheckoutButton
                    items={items}
                    disabled={lineItems.length === 0 || !meetsMinimumOrder}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {isEmpty ? (
            <div className="notice-box">
              <p className="feature-title">Your basket is empty</p>
              <p className="feature-copy">
                Add sauces from the shop to use the cart and Stripe checkout flow.
              </p>
              <div className="mt-4">
                <Link
                  href="/shop"
                  className={buttonVariants({ variant: "default", size: "default" })}
                >
                  Browse products
                </Link>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
