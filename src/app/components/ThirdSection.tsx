"use client";

import React from "react";
import Image from "next/image";

const ThirdSection = () => {
  return (
    <section className="container py-10 sm:py-15 lg:py-20">
      <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center py-10 sm:py-12 md:py-10">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Image */}
            <Image
 width={1000}
        height={1000}
            alt=""
              src="/images/BB-web-chai-2.gif"
              className="w-[180px] h-auto sm:w-[240px] sm:h-[160px] md:w-[250px] md:h-auto mx-auto mb-4 sm:mb-8"
            />

            {/* Animated Heading */}
            <h2
              className="
                text-center 
                flex flex-col sm:flex-row 
                justify-center items-center 
                gap-2 sm:gap-3 
               
              "
            >
              <span className="animated-word">Connect.</span>
              <span className="animated-word">Collaborate.</span>
              <span className="animated-word">Grow.</span>
            </h2>

            {/* Contact Info */}
             <div className="flex flex-col items-center justify-center gap-4 body3 white-text px-4 lg:p-0">

  {/* Projects */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 text-center sm:text-left">
    <span>For Projects and Gossip :</span>

    <a
      href="mailto:hello@bombayblokes.com"
      className="text-highlight sm:ml-1"
    >
      hello@bombayblokes.com
    </a>

    <span className="hidden sm:inline"> | </span>

    <a
      href="tel:+919987558189"
      className="text-highlight"
    >
      9987558189
    </a>
  </div>

  {/* Careers */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1 text-center sm:text-left">
    <span>For Careers / Jobs :</span>

    <a
      href="mailto:careers@bombayblokes.com"
      className="text-highlight sm:ml-1"
    >
      careers@bombayblokes.com
    </a>

    <span className="hidden sm:inline"> | </span>

    <a
      href="tel:+917738551454"
      className="text-highlight"
    >
      7738551454
    </a>
  </div>

</div>
          </div>
        </div>

        {/* Yellow Stripe */}
        {/* <div className="absolute right-0 top-0 w-3 sm:w-5 md:w-7 h-full bg-[#FAB31E]"></div> */}
        <div className="absolute right-0 top-0 h-full w-3 sm:w-5 md:w-5  candy-border"></div>

      </div>
    </section>
  );
};

export default ThirdSection;
