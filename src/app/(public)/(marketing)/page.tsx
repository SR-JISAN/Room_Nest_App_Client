"use client"

import BrandSection from "@/components/layout/public/BrandSection";
import JourneyMissionVision from "@/components/layout/public/JourneyMissionVision";
import HeroBanner from "@/components/modules/homepage/hero";


const page = () => {
  
    return (
        <section>
            <HeroBanner/>
            <BrandSection/>
            <JourneyMissionVision/>
        </section>
    );
};

export default page;