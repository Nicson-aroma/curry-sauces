import {
  HowItWorksSection,
  PageHero,
  ProductDetailsPreviewSection,
  RecipesSection,
} from "../../components/storefront-sections";
import { homeContent } from "../../lib/meahs-data";

export default function RecipesPage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Recipe inspiration"
        title="Easy curry-night ideas built around Meah’s chilled sauces"
        description="Browse sample recipe ideas, see which sauce each dish uses, and jump straight to the products page to build your own curry-night basket."
        imageUrl={homeContent.sliderImages[2]}
        actions={[
          { label: "Shop sauces", href: "/shop", primary: true },
          { label: "Contact the team", href: "/contact" },
        ]}
      />
      <RecipesSection compact />
      <HowItWorksSection />
      <ProductDetailsPreviewSection />
    </main>
  );
}
