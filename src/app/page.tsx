import React from 'react'
import Navbar from './components/Navbar'
import FirstSection from './components/FirstSection'
import Bulkgenerator from './components/Bulkgenerator'
import Chat from './components/Chat'
import ThirdSection from './components/ThirdSection'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'
import Taxi from './components/Taxi'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "AI Image Generator from Google Sheets | Bombay Blokes",
  description:
    "Generate high-quality AI images instantly using Google Sheets. Paste your sheet link and create bulk images in minutes. Fast, automated, and built for creators, marketers, and agencies.",
};

const Index = () => {
  return (
    <div>

      <Navbar />
      <FirstSection />
      <Bulkgenerator />
      <Chat />
      <ThirdSection />
      <Footer />

    </div>
  )
}

export default Index