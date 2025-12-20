import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Pricing } from "@/components/Pricing";

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="flex-1 flex flex-col">
                <Hero />
                <FeatureGrid />
                <Pricing />
            </main>
            <Footer />
        </>
    );
}
