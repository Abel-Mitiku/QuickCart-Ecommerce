"use client";

import { Footer } from "../products/components/footer";
import { ContactForm } from "./components/form";
import { Header } from "./components/header";
import { Navigation } from "./components/navigation";

export default function Home() {
  return (
    <div>
      <Navigation />
      <Header />
      <ContactForm />
      <Footer />
    </div>
  );
}
