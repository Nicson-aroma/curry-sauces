import { HeritageStorySection, PageHero, StoryStrip } from "../../components/storefront-sections";
import { heritageContent } from "../../lib/meahs-data";

export default function HeritagePage() {
  return (
    <main className="page-shell">
      <PageHero
        eyebrow="Our heritage"
        title="Built from decades of restaurant cooking and customer loyalty"
        description={heritageContent.paragraphs[0]}
        imageUrl={heritageContent.images[1]}
      />
      <StoryStrip />
      <HeritageStorySection />
    </main>
  );
}
