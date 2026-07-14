'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'


const IMAGES = [
  '/loader-01.jpg',
  '/loader-02.jpg',
  '/loader-03.jpg',
  '/loader-04.jpg',
  '/loader-05.jpeg',
]

const FRAME_W = 384
const FRAME_H = 576

export default function HeroIntro() {
  const sectionRef    = useRef<HTMLElement>(null)
  const frameRefs     = useRef<(HTMLDivElement | null)[]>([])
  const overlayRef    = useRef<HTMLDivElement>(null)
  const contentRef    = useRef<HTMLDivElement>(null)
  const namesRef      = useRef<HTMLDivElement>(null)
  const dateRef       = useRef<HTMLSpanElement>(null)
  const lineRef       = useRef<HTMLDivElement>(null)
  const locationRef   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const frames   = frameRefs.current.filter(Boolean) as HTMLDivElement[]
    const overlay  = overlayRef.current
    const content  = contentRef.current
    const names    = namesRef.current
    const date     = dateRef.current
    const line     = lineRef.current
    const location = locationRef.current
    if (!section || frames.length === 0 || !overlay || !content || !names || !date || !line || !location) return

    const vw = section.offsetWidth
    const vh = section.offsetHeight
    const cx = vw / 2 - FRAME_W / 2
    const cy = vh / 2 - FRAME_H / 2

    gsap.set(frames, {
      position: 'absolute',
      width:    FRAME_W,
      height:   FRAME_H,
      left:     cx,
      top:      cy,
      borderRadius: 3,
      scale:    0,
      opacity:  1,
    })

    gsap.set(overlay,  { opacity: 0 })
    gsap.set(names,    { opacity: 0, y: 40 })
    gsap.set(date,     { opacity: 0, y: 10 })
    gsap.set(line,     { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(location, { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.2 })

    frames.forEach((frame, i) => {
      tl.to(frame, { scale: 1, duration: 1.1, ease: 'power1.out' }, i * 0.3)
    })

    // Final image zooms to fill screen
    const last = frames[frames.length - 1]
    tl.to(last, {
      width:        vw,
      height:       vh,
      left:         0,
      top:          0,
      borderRadius: 0,
      scale:        1,
      duration:     1.4,
      ease:         'power2.inOut',
      onComplete: () => {
        gsap.set(last, { clearProps: 'width,height,left,top,scale' })
        last.style.inset  = '0'
        last.style.width  = '100%'
        last.style.height = '100%'
      },
    }, '+=0.08')

    tl.to(overlay, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    tl.to(names,   { opacity: 1, y: 0, duration: 1.2, ease: 'power1.out' }, '-=0.1')
    tl.to(date,    { opacity: 1, y: 0, duration: 1.0, ease: 'power1.out' }, '-=0.8')

    // 3. Line draws left → right toward Warsaw
    tl.to(line, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, '-=0.5')

    // 4. Location appears, then unlock scroll
    tl.to(location, { opacity: 1, duration: 1.0, ease: 'power1.out', onComplete: () => {
      window.dispatchEvent(new CustomEvent('hero:complete'))
    }}, '-=0.2')

    // Parallax: content moves up faster than the background image on scroll
    const parallax = gsap.to(content, {
      y: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      tl.kill()
      parallax.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="hero">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          ref={el => { frameRefs.current[i] = el }}
          className="hero__frame"
          style={{ zIndex: i + 1 }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes={i === IMAGES.length - 1 ? '100vw' : '400px'}
            className="object-cover"
            priority={i >= IMAGES.length - 2}
          />
        </div>
      ))}

      <div ref={overlayRef} className="hero__overlay" />

      <div ref={contentRef} className="hero__content">
        <div className="hero__meta">
          <span ref={dateRef} className="hero__date">14 September, 2026</span>
          <div ref={lineRef} className="hero__line" />
          <span ref={locationRef} className="hero__location">Warsaw, Poland</span>
        </div>

        <div ref={namesRef} className="hero__names">
          <div className="hero__name">Vadym</div>
          <div className="hero__name">&amp; Mariya</div>
        </div>
      </div>
    </section>
  )
}
