'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


const SLIDES = [
  '/location-01.jpg',
  '/location-02.jpg',
  '/location-03.jpg',
  '/location-04.jpg',
  '/location-05.jpg',
]

// location-03 is the composition's center image — it's already on screen (as the
// zoomed photo) once the pin ends, so the overlay never renders its own copy of it.
// That's what was causing the visible "swap" glitch between the zoom and the slider.
const CENTER_INDEX = 2

export default function LocationSection() {
  const stageRef       = useRef<HTMLDivElement>(null) // 100vh — pinned + scaled
  const compositionRef = useRef<HTMLDivElement>(null) // GSAP scales this
  const centerImgRef   = useRef<HTMLDivElement>(null)
  const overlayRef      = useRef<HTMLDivElement>(null)
  const arrowsRef       = useRef<HTMLDivElement>(null)
  const slideRefs       = useRef<(HTMLDivElement | null)[]>([])
  const autoTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null)
  const titleRef        = useRef<HTMLHeadingElement>(null)
  const eyebrowRef      = useRef<HTMLDivElement>(null)
  const lineLeftRef     = useRef<HTMLDivElement>(null)
  const lineRightRef    = useRef<HTMLDivElement>(null)

  const [active, setActive] = useState(CENTER_INDEX)
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null)

  const goTo = useCallback((dir: 1 | -1) => {
    setActive(prev => (prev + dir + SLIDES.length) % SLIDES.length)
    if (autoTimerRef.current) clearInterval(autoTimerRef.current)
  }, [])

  // Crossfade slides — CENTER_INDEX has no overlay element, so becoming active
  // just fades the others out, revealing the composition's center image underneath.
  useEffect(() => {
    SLIDES.forEach((_, i) => {
      if (i === CENTER_INDEX) return
      const el = slideRefs.current[i]
      if (!el) return
      gsap.to(el, { opacity: i === active ? 1 : 0, duration: 0.9, ease: 'power2.inOut' })
    })
  }, [active])

  // Title blur clear + eyebrow fade/line-draw on scroll — same treatment as IntroSection.
  useEffect(() => {
    const tweens: gsap.core.Tween[] = []
    const title = titleRef.current
    if (title) {
      tweens.push(gsap.fromTo(title,
        { filter: 'blur(8px)' },
        { filter: 'blur(0px)', ease: 'none', scrollTrigger: { trigger: title, start: 'top 85%', end: 'top 30%', scrub: 1.2 } }
      ))
    }

    if (eyebrowRef.current) {
      const trigger = { trigger: eyebrowRef.current, start: 'top 85%' }
      tweens.push(gsap.fromTo(eyebrowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: trigger }
      ))
      tweens.push(gsap.fromTo([lineLeftRef.current, lineRightRef.current],
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power2.out', delay: 0.2, scrollTrigger: trigger }
      ))
    }

    return () => { tweens.forEach(t => t.kill()) }
  }, [])

  useEffect(() => {
    const stage       = stageRef.current
    const composition = compositionRef.current
    const centerImg    = centerImgRef.current
    const overlay      = overlayRef.current
    const arrows       = arrowsRef.current
    if (!stage || !composition || !centerImg || !overlay || !arrows) return

    const vw = window.innerWidth
    const vh = window.innerHeight

    // Measure center image (in its natural position, before any GSAP transforms)
    const imgRect = centerImg.getBoundingClientRect()

    // Scale that makes the center image cover the full viewport
    const scaleX = vw / imgRect.width
    const scaleY = vh / imgRect.height
    const finalScale = Math.max(scaleX, scaleY)

    // Initial state — overlay itself stays visible throughout; it only ever paints
    // the non-center slides, which are transparent until they're the active one.
    gsap.set(overlay, { opacity: 1 })
    gsap.set(arrows,  { opacity: 0, y: 16, pointerEvents: 'none' })

    let fullyZoomed = false

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'center center',
        end: '+=2500',
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          if (self.progress >= 0.99 && !fullyZoomed) {
            fullyZoomed = true
            gsap.to(arrows, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' })
            autoTimerRef.current = setInterval(() => {
              setActive(prev => (prev + 1) % SLIDES.length)
            }, 3500)
          } else if (self.progress < 0.99 && fullyZoomed) {
            fullyZoomed = false
            gsap.to(arrows, { opacity: 0, y: 16, duration: 0.3, pointerEvents: 'none' })
            if (autoTimerRef.current) clearInterval(autoTimerRef.current)
            // Reset back to the center photo so the un-zoom always reveals the
            // same image the composition is scaling down to.
            setActive(CENTER_INDEX)
          }
        },
      },
    })

    // Whole composition scales up from its own center — reverses cleanly on scroll-up
    // since it's a plain scrubbed tween tied to scroll position either direction.
    tl.to(composition, {
      scale: finalScale,
      transformOrigin: 'center center',
      ease: 'power2.inOut',
      duration: 1,
    }, 0)

    return () => {
      tl.kill()
      if (autoTimerRef.current) clearInterval(autoTimerRef.current)
    }
  }, [])

  return (
    <section className="location">
      <div className="location__header">
        <div ref={eyebrowRef} className="location__eyebrow">
          <div ref={lineLeftRef} className="location__eyebrow-line location__eyebrow-line--left" />
          <span className="location__eyebrow-label">Wedding Location</span>
          <div ref={lineRightRef} className="location__eyebrow-line location__eyebrow-line--right" />
        </div>
        <h2 ref={titleRef} className="location__title">We&#39;ll see you at Cicha 23</h2>
        <p className="location__address">ul. Cicha 23, 05-260 Marki, Warsaw area, Poland</p>
      </div>

      <div ref={stageRef} className="location__stage">
        <div ref={compositionRef} className="location__composition">
          <div className="location__col location__col--left">
            <div className="location__col-img"><Image src="/location-01.jpg" alt="" fill className="object-cover" /></div>
            <div className="location__col-img"><Image src="/location-02.jpg" alt="" fill className="object-cover" /></div>
          </div>

          <div ref={centerImgRef} className="location__center-img">
            <Image src="/location-03.jpg" alt="" fill className="object-cover" priority />
          </div>

          <div className="location__col location__col--right">
            <div className="location__col-img"><Image src="/location-04.jpg" alt="" fill className="object-cover" /></div>
            <div className="location__col-img"><Image src="/location-05.jpg" alt="" fill className="object-cover" /></div>
          </div>
        </div>

        <div ref={overlayRef} className="location__overlay">
          {SLIDES.map((src, i) => (
            i === CENTER_INDEX ? null : (
              <div key={src} ref={el => { slideRefs.current[i] = el }} className="location__slide">
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            )
          ))}
        </div>

        <div ref={arrowsRef} className="location__arrows">
          <button
            onClick={() => goTo(-1)}
            onMouseEnter={() => setHoveredArrow('prev')}
            onMouseLeave={() => setHoveredArrow(null)}
            aria-label="Previous"
            className="location__arrow location__arrow--prev"
            style={{ background: hoveredArrow === 'prev' ? '#100802' : '#fff' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke={hoveredArrow === 'prev' ? '#fff' : '#100802'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => goTo(1)}
            onMouseEnter={() => setHoveredArrow('next')}
            onMouseLeave={() => setHoveredArrow(null)}
            aria-label="Next"
            className="location__arrow location__arrow--next"
            style={{ background: hoveredArrow === 'next' ? '#100802' : '#fff' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke={hoveredArrow === 'next' ? '#fff' : '#100802'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
