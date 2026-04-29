import Link from "next/link";
import Image from "next/image";

import AssetCarousel from "../components/asset-carousel";
import HomeOfferBar from "../components/home-offer-bar";
import { buttonVariants } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { brand, homeContent } from "../lib/meahs-data";

export default function Home() {
  return (
    <main className="page-shell">
      <HomeOfferBar />

      <Card className="page-panel">
        <CardContent className="p-4 md:p-5">
          <AssetCarousel imageUrls={homeContent.sliderImages} altPrefix="Meahs home slide" />
        </CardContent>
      </Card>

      <Card className="page-panel">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl md:text-[2.2rem]">{homeContent.title}</CardTitle>
          <p className="welcome-subtitle">{homeContent.subtitle}</p>
        </CardHeader>
        <CardContent className="home-feature-layout">
          <div className="space-y-5">
            {homeContent.introParagraphs.map((paragraph) => (
              <p key={paragraph} className="body-copy">
                {paragraph}
              </p>
            ))}
            <p className="body-copy text-center font-semibold">
              {homeContent.availability}
            </p>
            <div className="cta-row">
              <Link
                href="/shop"
                className={buttonVariants({ variant: "default", size: "default" })}
              >
                Shop
              </Link>
              <Link
                href="/contact"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="home-side-image">
            <Image
              src={homeContent.featureImage}
              alt="Meah's curry sauces feature"
              fill
              sizes="(max-width: 900px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-xl">Our Awards</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {brand.awards.map((award) => (
            <div key={award.title} className="award-box">
              <Image
                src={award.imageUrl}
                alt={award.title}
                width={180}
                height={100}
                className="award-image"
              />
              <span>{award.title}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
