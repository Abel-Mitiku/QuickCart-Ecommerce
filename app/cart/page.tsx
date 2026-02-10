"use client";

import { Footer } from "../products/components/footer";
import { Cart } from "./components/carts";
import { Navigation } from "./components/navigation";
import StripeProvider from "./components/StripeProvider";

export default function Home() {
  return (
    <div>
      <Navigation />
      <StripeProvider>
        <Cart />
      </StripeProvider>
      <Footer />
    </div>
  );
}
