import { Suspense } from "react";

import CheckoutSuccessContent from "../../../components/checkout-success-content";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
