"use client";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Product } from "./components/products";
import { Footer } from "./components/footer";
import StripeProvider from "../cart/components/StripeProvider";
import Stripe from "stripe";

export default function Products() {
  return (
    <div>
      <Navigation />
      <Header />
      <StripeProvider>
        <Product />
      </StripeProvider>
      <Footer />
    </div>
  );
}
