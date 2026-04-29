import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { newsContent } from "../../lib/meahs-data";

export default function NewsPage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">{newsContent.title}</CardTitle>
          <CardDescription className="max-w-3xl text-base">
            {newsContent.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="event-hero-image">
            <Image
              src={newsContent.heroImage}
              alt="News hero"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="news-grid">
            {newsContent.items.map((item) => (
              <article key={item.imageUrl} className="news-card">
                <div className="news-card-image">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                  <p className="feature-copy !mt-0">{item.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
