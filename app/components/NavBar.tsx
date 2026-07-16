'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function NavBar() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const hero = document.querySelector('.hero')
    const pastHero = hero ? hero.getBoundingClientRect().bottom <= 0 : false
    gsap.set(nav, { yPercent: pastHero ? 0 : -100 })

    let ready = false
    const showTrigger = ScrollTrigger.create({
      trigger: '.hero',
      start: 'bottom top',
      onEnter:     () => { if (ready) gsap.to(nav, { yPercent: 0, duration: 0.5, ease: 'power2.out' }) },
      onLeaveBack: () => gsap.to(nav, { yPercent: -100, duration: 0.4, ease: 'power2.in' }),
    })
    ready = true

    return () => showTrigger.kill()
  }, [])

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector)
    ;(window as any).__lenis?.scrollTo(el)
  }

  return (
    <nav ref={navRef} className="nav" aria-label="Site navigation">
      <div className="nav__left">
        <span className="nav__date">14 / 09 / 26</span>
        <a
          className="nav__link"
          href="https://maps.app.goo.gl/VR67EL9vxRoVgBXQA"
          target="_blank"
          rel="noopener noreferrer"
        >LOCATION</a>
      </div>

      <div className="nav__brand" aria-hidden>
        <p>Vadym</p>
        <p>&amp; Mariya</p>
      </div>

      <div className="nav__right">
        <button className="nav__link" onClick={() => scrollTo('.cta')}>RSVP NOW</button>
      </div>
    </nav>
  )
}
