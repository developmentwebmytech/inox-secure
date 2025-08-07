import { CategoryCarousel } from "@/components/CategoryCarousel";
import AnimatedCategories from "@/components/animated-categories";
import { HeroSection } from "@/components/hero-section";
import FeatuedSection from "@/components/features-section";
import HomeServicesSection from "@/components/Services";
import { ElectronicsBannerSection } from "@/components/Electronics-banner";
import PromoSection from "@/components/ServiceImage";
import MegaSale from "@/components/MegaSale";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <main>
        {/* Hero Section */}

        {/* Animated Categories Section */}
        <AnimatedCategories />

        {/* Hot Deals Section */}
        {/* <HotDealsSection /> */}

        {/* Categories Section */}

        {/* Featured Electronics */}
        <section className="py-16 px-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0042adef] mb-4">
                Electronics
              </h2>
              <p className="text-gray-600">
                Explore our range of TVs, audio systems, and smart devices
              </p>
            </div>
            <CategoryCarousel category="electronics" showAll />
          </div>
        </section>

        <ElectronicsBannerSection />
        {/* Featured Home Appliances */}
        <section className="py-16 px-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-orange-500 mb-4">
                Home Appliances
              </h2>
              <p className="text-gray-600">
                Discover kitchen and home appliances to make your life easier
              </p>
            </div>
            <CategoryCarousel category="appliances" showAll />
          </div>
        </section>

        {/* Featured IT Products */}
        <section className="py-16 px-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-orange-500 mb-4">
                IT Products
              </h2>
              <p className="text-gray-600">
                Discover best solutions for your IT needs
              </p>
            </div>
            <CategoryCarousel category="it-products" showAll />
          </div>
        </section>

        {/* Service Image */}
        <PromoSection />
        {/* Services Section */}
        <HomeServicesSection />
        <MegaSale />

        {/* Trending */}
        <section className="py-16 px-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#0042adef] mb-4">
                Trending
              </h2>
              <p className="text-gray-600">
                Explore our range of TVs, audio systems, and smart devices
              </p>
            </div>
            <CategoryCarousel category="electronics" showAll />
          </div>
        </section>

        {/* Featured Section */}
        <FeatuedSection />
      </main>
    </div>
  );
}
