## Setup

Install dependencies and add the required environment variables:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
MONGODB_URI=mongodb://127.0.0.1:27017/meahs_website
MONGODB_DB=meahs_website
```

Then start MongoDB locally or point `MONGODB_URI` at your hosted cluster and run:

```bash
npm run dev
```

## MongoDB persistence

The project now stores staff users and order history in MongoDB instead of browser `localStorage`.

- Manager sign-up writes pending staff accounts to the `users` collection.
- Admin and manager order updates write to the `orders` collection.
- Stripe checkout creates an order record before redirecting to payment.
- Checkout success finalizes the order in MongoDB using the Stripe session ID.
- The default admin account is automatically seeded on first use.

If MongoDB is unavailable or `MONGODB_URI` is missing, the staff dashboard and checkout order persistence APIs will return an error until the database is configured.
