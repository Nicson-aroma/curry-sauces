import { EventsSection, PageHero } from "../../components/storefront-sections";
import { eventsContent } from "../../lib/meahs-data";

export default function EventsPage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Events and tastings"
        title="Meet the team at food festivals, markets, and local shows"
        description={eventsContent.description}
        imageUrl={eventsContent.heroImage}
      />
      <EventsSection compact />
    </main>
  );
}
