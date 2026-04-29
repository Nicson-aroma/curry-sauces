import Link from "next/link";

import { buttonVariants } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <main className="page-shell">
      <Card className="page-panel">
        <CardHeader>
          <CardTitle className="text-3xl">Checkout Cancelled</CardTitle>
          <CardDescription className="text-base">
            Your Stripe test checkout was cancelled before payment completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="body-copy">
            Your basket is still available, so you can return and try the payment
            flow again.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/cart"
              className={buttonVariants({ variant: "default", size: "default" })}
            >
              Back to cart
            </Link>
            <Link
              href="/shop"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
              Continue shopping
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
