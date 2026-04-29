import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { heritageContent } from "../../lib/meahs-data";

export default function HeritagePage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">{heritageContent.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="image-pair-grid">
            {heritageContent.images.map((imageUrl, index) => (
              <div key={imageUrl} className="feature-image-card">
                <Image
                  src={imageUrl}
                  alt={`Heritage image ${index + 1}`}
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {heritageContent.paragraphs.map((paragraph) => (
            <p key={paragraph} className="body-copy">
              {paragraph}
            </p>
          ))}
          <p className="body-copy font-semibold">{heritageContent.closing}</p>
          <div className="notice-box">
            {heritageContent.notice}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
