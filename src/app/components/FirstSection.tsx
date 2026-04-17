"use client";
import React from 'react'
import Button from './Button';
import { useRouter } from "next/navigation";


const FirstSection = () => {

    const router = useRouter();

  const handleClick = () => {
    // Open Google Sheet in new tab
    window.open(
      process.env.NEXT_PUBLIC_REDIRECT_SHEET_URL as string,
      "_blank"
    );

    // Navigate to your page
    router.push("/bulkimggenerator");
  };
  return (
     <div className="w-full min-h-screen flex items-center justify-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">

        {/* BULK IMAGE GENERATOR */}

      <div className="bg-[#1D1D1D] p-6 rounded-[20px] relative overflow-hidden w-full max-w-lg">    
               
              <h3 className=" font-semibold mb-4 text-highlight">
            Bulk Image Generator
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <li>• Opens a Google Sheet automatically in a new tab</li>
            <li>• Fill in all required fields as per the sheet structure</li>
            <li>• Add product details, prompts, references, and variations</li>
            <li>• Paste the sheet link back into the tool</li>
            <li>• AI processes all entries in bulk</li>
            <li>• Generated images are saved directly to Google Drive</li>
          </ul>

          <div className="absolute right-0 top-0 h-full w-3 candy-border"></div>
    <div className="flex items-center py-5">
            <Button
      text="Generate Now"
      className="text-white"
      onClick={handleClick}
    />
          </div>
        </div>

        {/* IMAGE GENERATOR */}
      <div className="bg-[#1D1D1D] p-6 rounded-[20px] relative overflow-hidden w-full max-w-lg">  
                 <h3 className=" font-semibold mb-4 text-highlight">
            Image Generator
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <li>• Enter a detailed prompt describing the desired output</li>
            <li>• Upload a product image</li>
            <li>• Optionally add a reference image for styling</li>
            <li>• Choose variations, ratio, and output preferences</li>
            <li>• AI analyzes inputs and generates the image</li>
            <li>• Final output is automatically saved to Google Drive</li>
          </ul>
           <div className="flex items-center py-5">
            <Button
            href='/imggenerator'
              text="Generate Now"
              className="text-white"
            />
          </div>
                    <div className="absolute right-0 top-0 h-full w-3 candy-border"></div>

        </div>

      </div>
    </div>
  )
}

export default FirstSection