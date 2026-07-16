'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  useEffect(() => {
    // Always start at the top on page load/refresh
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    ;(window as any).__lenis = lenis

    // Block scroll until hero animation signals completion (5s failsafe)
    lenis.stop()
    const startLenis = () => { lenis.start(); ScrollTrigger.refresh() }
    const failsafe = setTimeout(startLenis, 5000)
    const onHeroComplete = () => { clearTimeout(failsafe); startLenis() }
    window.addEventListener('hero:complete', onHeroComplete, { once: true })

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      clearTimeout(failsafe)
      window.removeEventListener('hero:complete', onHeroComplete)
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])

  return null
}
