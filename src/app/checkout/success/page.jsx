import Link from "next/link";

import { buttonVariants } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function CheckoutSuccessPage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">Payment Complete</CardTitle>
          <CardDescription className="text-base">
            Stripe returned to the site after a successful test checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="body-copy">
            This confirms the redirect flow is working. If you want the basket to
            clear automatically after success, I can add webhook-backed order
            handling next.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className={buttonVariants({ variant: "default", size: "default" })}
            >
              Return to shop
            </Link>
            <Link
              href="/cart"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              View cart
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
