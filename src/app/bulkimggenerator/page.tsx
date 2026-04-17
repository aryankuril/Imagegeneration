import React from 'react'
import Navbar from '../components/Navbar'
import Bulkgenerator from '../components/Bulkgenerator'
import ThirdSection from '../components/ThirdSection'
import Footer from '../components/Footer'
import SmoothScroll from '../components/SmoothScroll'
import Taxi from '../components/Taxi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Bulk AI Image Generator with Google Sheets | Bombay Blokes",
  description:
    "Generate hundreds of AI images in bulk using Google Sheets. Add prompts, product details, and variations, then automate image creation at scale. Built for marketers, agencies, and eCommerce growth.",
};

const Index = () => {
  return (
    <div>

      <Navbar />
      <Bulkgenerator />
      <ThirdSection />
      <Footer />

    </div>
  )
}

export default Index