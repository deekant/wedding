import NavBar from './components/NavBar'
import HeroIntro from './components/HeroIntro'
import IntroSection from './components/IntroSection'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import TimelineSection from './components/TimelineSection'
import WearSection from './components/WearSection'
import StripSection from './components/StripSection'
import GiftSection from './components/GiftSection'
import CTASection from './components/CTASection'

export default function Home() {
  return (
    <main>
      <NavBar />
      <HeroIntro />
      <IntroSection />
      <GallerySection />
      <LocationSection />
      <TimelineSection />
      <WearSection />
      <StripSection />
      <GiftSection />
      <CTASection />
    </main>
  )
}
