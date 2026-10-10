"use client";

import BrandSection from "@/components/layout/public/BrandSection";
import JourneyMissionVision from "@/components/layout/public/JourneyMissionVision";
import BenefitsAndTrust from "@/components/modules/homepage/BenefitsAndTrust";
import FeaturedProperties from "@/components/modules/homepage/FeaturedProperties";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import HeroBanner from "@/components/modules/homepage/hero";
import PropertyTypesSection from "@/components/modules/homepage/PropertyTypesSection";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner />
      <PropertyTypesSection />
      <FeaturedProperties />
      <HowItWorks />
      <BrandSection />
      <BenefitsAndTrust />
      <JourneyMissionVision />
    </div>
  );
}
