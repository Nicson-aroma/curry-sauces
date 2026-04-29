import Image from "next/image";
import { Phone } from "lucide-react";

import { brand } from "../lib/meahs-data";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="footer-panel">
          <p className="footer-heading">Connect with us</p>
          <div className="footer-socials">
            {brand.socialLinks.map((social) => (
              <span key={social.name} className="footer-social">
                <Image
                  src={social.iconUrl}
                  alt={social.name}
                  width={18}
                  height={18}
                  className="footer-social-icon"
                />
                {social.name}
              </span>
            ))}
          </div>
        </div>

        <div className="footer-panel">
          <p className="footer-heading">Contact Us</p>
          <p className="footer-contact-line">
            <Phone className="size-4" />
            Tel: {brand.phone}
          </p>
          <p className="mt-2">Email: {brand.email}</p>
          <p className="mt-2">{brand.address}</p>
        </div>

        <div className="footer-panel">
          <p className="footer-heading">Our Awards</p>
          <div className="footer-awards">
            {brand.awards.map((award) => (
              <div key={award.title} className="footer-award-item">
                <Image
                  src={award.imageUrl}
                  alt={award.title}
                  width={56}
                  height={56}
                  className="footer-award-image"
                />
                <span>{award.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="site-footer-bottom">
        <p>Copyright Meah&apos;s Curry Sauces {new Date().getFullYear()}</p>
        <p>Home | Our Sauces | Our Heritage | Events & Shows | News | Contact Us</p>
      </div>
    </footer>
  );
}
