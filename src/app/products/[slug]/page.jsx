import Link from "next/link";
import { notFound } from "next/navigation";

import ProductImage from "../../../components/product-image";
import { Badge } from "../../../components/ui/badge";
import { buttonVariants } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { getProductDetails, productDetailsBySlug } from "../../../lib/meahs-data";

export function generateStaticParams() {
  return Object.keys(productDetailsBySlug).map((slug) => ({ slug }));
}

export default function ProductDetailsPage({ params }) {
  const details = getProductDetails(params.slug);

  if (!details) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/shop"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          Back to products
        </Link>
        <Badge variant="outline">{details.price}</Badge>
      </div>

      <Card className="page-panel overflow-hidden">
        <CardHeader className="space-y-4">
          <div className="detail-hero-image">
            <ProductImage
              src={details.imageUrl}
              alt={details.name}
              className="h-full w-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl">{details.name}</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            {details.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <section className="detail-copy-block">
            <h2 className="detail-section-title">Ingredients and allergens</h2>
            <p className="detail-section-copy">{details.ingredientsAllergens}</p>
          </section>

          {details.recipeIdea ? (
            <section className="detail-copy-block">
              <h2 className="detail-section-title">Recipe idea</h2>
              <p className="detail-section-copy">{details.recipeIdea}</p>
            </section>
          ) : null}

          <section className="grid gap-4 md:grid-cols-2">
            <div className="feature-card">
              <h3 className="feature-title">Nutrition per 100g</h3>
              <p className="feature-copy">{details.nutritionPer100g}</p>
            </div>
            <div className="feature-card feature-card-accent">
              <h3 className="feature-title">Serves</h3>
              <p className="feature-copy">{details.serves}</p>
            </div>
          </section>

          <section className="detail-copy-block">
            <h2 className="detail-section-title">Storage</h2>
            <p className="detail-section-copy">{details.storage}</p>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
