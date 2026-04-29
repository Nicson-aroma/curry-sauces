import Link from "next/link";

import ShopProductGrid from "../../components/shop-product-grid";
import { buttonVariants } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { products } from "../../lib/meahs-data";

export default function ShopPage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">Our Products</CardTitle>
          <CardDescription className="max-w-4xl text-base">
            Our chef&apos;s combine a blend of traditional spices and locally grown
            fresh produce, all you need to do is cook your meat or vegetables and
            add sauce - giving you exactly what you desired without leaving the
            house or making a dent in your pocket.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bundle-grid">
            <div className="bundle-box">
              <p className="bundle-price">6 Sauces @ GBP 28.20</p>
            </div>
            <div className="bundle-box">
              <p className="bundle-price">12 Sauces @ GBP 47.50</p>
            </div>
          </div>

          <p className="body-copy">
            Includes Postage &amp; Packing. Please note this is a chilled product and
            should be stored under refrigeration upon delivery.
          </p>

          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Product catalogue</h2>
            <Link
              href="/cart"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              View Cart
            </Link>
          </div>

          <ShopProductGrid products={products} />
        </CardContent>
      </Card>
    </main>
  );
}
