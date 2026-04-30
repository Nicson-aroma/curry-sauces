import {
  BundlePricingSection,
  DeliverySection,
  PageHero,
  ProductShowcaseSection,
} from "../../components/storefront-sections";
import { homeContent } from "../../lib/meahs-data";

export default function ShopPage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Shop chilled sauces"
        title="Choose premium curry sauces for your next family meal"
        description="Browse Meah’s signature chilled sauce range, filter by heat level, and build a basket in batches of 6 or 12."
        imageUrl={homeContent.sliderImages[1]}
        actions={[
          { label: "Start shopping", href: "#products", primary: true },
          { label: "Delivery information", href: "#delivery" },
        ]}
      />
      <ProductShowcaseSection compact />
      <BundlePricingSection />
      <DeliverySection />
    </main>
  );
}
