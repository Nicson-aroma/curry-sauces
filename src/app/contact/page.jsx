import { ContactSection, PageHero } from "../../components/storefront-sections";
import { eventsContent } from "../../lib/meahs-data";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Contact us"
        title="Speak to Meah’s about retail orders, wholesale supply, or feedback"
        description="Whether you are stocking chilled curry sauces, planning an event order, or need delivery support, the team can help."
        imageUrl={eventsContent.heroImage}
      />
      <ContactSection />
    </main>
  );
}
