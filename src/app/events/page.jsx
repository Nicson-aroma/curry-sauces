import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { eventsContent } from "../../lib/meahs-data";

export default function EventsPage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">{eventsContent.title}</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            {eventsContent.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="event-hero-image">
            <Image
              src={eventsContent.heroImage}
              alt="Meah's market stall"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <section aria-label="Image gallery">
            <p className="mb-3 text-sm font-semibold text-foreground">Photo gallery</p>
            <div className="gallery-grid">
              {eventsContent.galleryImages.map((imageUrl, index) => (
                <div key={imageUrl} className="gallery-placeholder">
                  <Image
                    src={imageUrl}
                    alt={`Event gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
