import React from 'react'
import Navbar from '../components/Navbar'
import Chat from '../components/Chat'
import ThirdSection from '../components/ThirdSection'
import Footer from '../components/Footer'
import SmoothScroll from '../components/SmoothScroll'
import Taxi from '../components/Taxi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AI Image Generator from Prompt & Product Images | Bombay Blokes",
  description:
    "Create high-quality AI images using prompts, product images, and reference styles. Customize variations, ratios, and outputs with precision. Perfect for ads, branding, and product visuals.",
};

const Index = () => {
  return (
    <div>

      <Navbar />
      <Chat />
      <ThirdSection />
      <Footer />

    </div>
  )
}

export default Index