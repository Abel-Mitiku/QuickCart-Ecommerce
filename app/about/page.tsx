"use client";
import { Footer } from "../products/components/footer";
import { Cards } from "./components/cards";
import { Experience } from "./components/experience";
import { Header } from "./components/header";
import { Navigation } from "./components/navigation";
import { Story } from "./components/story";

export default function Home() {
  return (
    <div>
      <Navigation />
      <Header />
      <Story />
      <Cards />
      <Experience />
      <Footer />
    </div>
  );
}
