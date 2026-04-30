import HomeOfferBar from "../components/home-offer-bar";
import {
  BundlePricingSection,
  ContactSection,
  DeliverySection,
  EventsSection,
  HeritageStorySection,
  HeroSection,
  HowItWorksSection,
  ProductDetailsPreviewSection,
  ProductShowcaseSection,
  RecipesSection,
  StoryStrip,
} from "../components/storefront-sections";

export default function Home() {
  return (
    <main className="page-shell">
      <HomeOfferBar />
      <HeroSection />
      <StoryStrip />
      <ProductShowcaseSection />
      <BundlePricingSection />
      <HowItWorksSection />
      <HeritageStorySection />
      <ProductDetailsPreviewSection />
      <EventsSection />
      <RecipesSection />
      <DeliverySection />
      <ContactSection />
    </main>
  );
}
