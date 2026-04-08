import React from 'react'
import Button from "./Button";
import { clsx } from 'clsx';


type CardData = {
   icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  href?: string;
  comingSoon?: boolean;
};




const cardsData: CardData[] = [

    {
    title: "Ready Components",
    description: "Production ready React, Next.js, Tailwind components to copy, customize, ship faster.",
    image: "/images/calculator/Web-Development.png",
    buttonText: "Try Now",
    href: "https://readycomponents.bombayblokes.com",
      icon: (
  <img
    src="/images/readycomponent.svg"
    alt="Image Effects"
    width={60}
    height={60}
  />
),
  },
    {
    title: "Figma Components",
    description: "Ready to use Figma components and design systems for faster design.",    image: "/images/calculator/Web-Development.png",
    buttonText: "Try Now",
    href: "https://www.figma.com/@bombayblokes",
    icon: (
  <img
    src="/images/figmacomponent2.svg"
    alt="Image Effects"
    width={60}
    height={60}
  />
),
  },
   
];
const FourthSection = () => {
  return (
    <section id="second-section"className="w-full container py-10 sm:py-15 lg:py-20 ">

        <h2 className=' font-semibold text-center py-10 '> <span className="text-highlight"> Dev  </span> Community</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {cardsData.map((card, index) => (
            <div
              key={index}
              className="relative bg-white border border-[#fab31e]  black-text rounded-3xl overflow-hidden shadow-lg"
            >
              {/* Yellow right strip */}
              <div className="absolute right-0 top-0 h-full w-3 sm:w-5 md:w-5  candy-border"></div>

              {/* Image */}
             <div className=" p-5 relative w-full h-auto mx-auto mt-4">
{card.icon}


</div>


              {/* Content */}
              <div className="p-6 flex flex-col justify-between h-auto">
                <div>
                  <h3 className="font-semibold mb-3">{card.title}</h3>
                 <p className="black-text body2 max-w-lg">
  {card.description}
</p>
                  
                </div>

                {/* Button */}
              <div className="mt-6 flex">
  <Button
    text="Try Now"
    href={card.href}
    className="w-full"
  />
</div>

              </div>
              
            </div>
          ))}
        </div>
    </section>
  )
}

export default FourthSection