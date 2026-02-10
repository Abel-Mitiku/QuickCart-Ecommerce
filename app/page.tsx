"use client";
import { Navigation } from "./components/navigation";
import { FirstSlider } from "./components/firstSlider";
import { Blog } from "./components/blog";
import { Arrival } from "./components/arrival";
import { Products } from "./components/products";
import { Footer } from "./components/footer";
import StripeProvider from "./cart/components/StripeProvider";

export default function Home() {
  return (
    <div className="none-overflow-">
      <Navigation />
      <FirstSlider />
      <Blog />
      <Arrival />
      <StripeProvider>
        <Products />
      </StripeProvider>
      <Footer />
    </div>
  );
}
