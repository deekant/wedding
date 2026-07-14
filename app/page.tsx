import HeroIntro from './components/HeroIntro'
import IntroSection from './components/IntroSection'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import TimelineSection from './components/TimelineSection'

export default function Home() {
  return (
    <main>
      <HeroIntro />
      <IntroSection />
      <GallerySection />
      <LocationSection />
      <TimelineSection />
    </main>
  )
}
