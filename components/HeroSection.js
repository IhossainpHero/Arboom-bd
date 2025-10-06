"use client";
import BannerImage from "@/public/images/arboom-banner.jpg";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="w-full bg-gray-50">
      {/* wrapper কে responsive করলাম */}
      <div className="w-full pt-6 sm:pt-8 md:pt-12 mb-10">
        <div className="overflow-hidden shadow-md">
          <Image
            src={BannerImage}
            alt="Hero Banner"
            priority
            className="w-full h-auto object-cover 
                       sm:rounded-2xl sm:max-w-7xl sm:mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
