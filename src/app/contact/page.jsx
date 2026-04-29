import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { brand } from "../../lib/meahs-data";

export default function ContactPage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">Contact Us</CardTitle>
          <CardDescription className="max-w-4xl text-base">
            Customers can contact the company for product enquiries or feedback
            using the form or listed contact details.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="contact-details">
            <h2 className="text-lg font-semibold">{brand.companyName}</h2>
            <p className="body-copy">Telephone: {brand.phone}</p>
            <p className="body-copy">Email: {brand.email}</p>
            <p className="body-copy">{brand.address}</p>
          </div>

          <form className="contact-form contact-form-panel">
            <h2 className="text-lg font-semibold">Send us a message</h2>
            <Input name="name" placeholder="Name" />
            <Input name="email" type="email" placeholder="Email address" required />
            <select name="enquiryType" className="form-select" defaultValue="general">
              <option value="general">General enquiry</option>
              <option value="trade">Trade enquiry</option>
              <option value="feedback">Feedback</option>
            </select>
            <Textarea name="message" placeholder="Message" />
            <Button className="w-fit" type="submit">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
