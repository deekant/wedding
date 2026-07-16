'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

const SLIDES = [
  '/location-01.jpg',
  '/location-02.jpg',
  '/location-03.jpg',
  '/location-04.jpg',
  '/location-05.jpg',
]

const CENTER_INDEX = 2  // location-03 is the composition's center image
const ZOOM_SCROLL  = 2500

export default function LocationSection() {
  const stageRef       = useRef<HTMLDivElement>(null)
  const compositionRef = useRef<HTMLDivElement>(null)
  const centerImgRef   = useRef<HTMLDivElement>(null)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const borderRef      = useRef<HTMLDivElement>(null)
  const prevRef        = useRef<HTMLButtonElement>(null)
  const nextRef        = useRef<HTMLButtonElement>(null)
  const slideRefs      = useRef<(HTMLDivElement | null)[]>([])
  const titleRef       = useRef<HTMLHeadingElement>(null)
  const eyebrowRef     = useRef<HTMLDivElement>(null)
  const lineLeftRef    = useRef<HTMLDivElement>(null)
  const lineRightRef   = useRef<HTMLDivElement>(null)

  const [active, setActive]             = useState(CENTER_INDEX)
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null)

  // Arrow clicks: cycle through slides, no scroll needed
  const goTo = useCallback((dir: 1 | -1) => {
    setActive(prev => (prev + dir + SLIDES.length) % SLIDES.length)
  }, [])

  // Crossfade slides on active change
  useEffect(() => {
    SLIDES.forEach((_, i) => {
      const el = slideRefs.current[i]
      if (!el) return
      gsap.to(el, { opacity: i === active ? 1 : 0, duration: 0.9, ease: 'power2.inOut' })
    })
  }, [active])

  // Title blur + eyebrow scroll animations
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

  // Zoom — fills viewport with 40px inset, then reveals overlay slider with dwell
  useEffect(() => {
    const stage       = stageRef.current
    const composition = compositionRef.current
    const centerImg   = centerImgRef.current
    const overlay     = overlayRef.current
    const border      = borderRef.current
    const prev        = prevRef.current
    const next        = nextRef.current
    if (!stage || !composition || !centerImg || !overlay || !border || !prev || !next) return

    const INSET      = 40
    const DWELL_SCROLL = 1500  // extra scroll distance to dwell in slider state
    const vw      = window.innerWidth
    const vh      = window.innerHeight
    const imgRect = centerImg.getBoundingClientRect()
    const finalScale = Math.max(
      (vw - INSET * 2) / imgRect.width,
      (vh - INSET * 2) / imgRect.height,
    )

    slideRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { opacity: i === CENTER_INDEX ? 1 : 0 })
    })
    gsap.set(overlay, { opacity: 0 })
    // Start border at 0px spread — will grow to 40px on entry
    gsap.set(border, { boxShadow: 'inset 0 0 0 0px #F5F2ED' })
    gsap.set([prev, next], { opacity: 0, y: 16, pointerEvents: 'none' })

    let fullyZoomed = false
    let autoRotate: ReturnType<typeof setInterval> | null = null

    // Zoom completes at this progress fraction of the total pin
    const ZOOM_DONE = ZOOM_SCROLL / (ZOOM_SCROLL + DWELL_SCROLL)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        start: 'center center',
        end: `+=${ZOOM_SCROLL + DWELL_SCROLL}`,
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          if (self.progress >= ZOOM_DONE - 0.02 && !fullyZoomed) {
            fullyZoomed = true
            // Border grows in from 0 to 40px
            gsap.to(border, { boxShadow: 'inset 0 0 0 40px #F5F2ED', duration: 0.7, ease: 'power3.out' })
            gsap.to(overlay, { opacity: 1, duration: 0.5, ease: 'power2.out' })
            gsap.to([prev, next], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', pointerEvents: 'auto' })
            // Auto-rotate every 2.5s
            autoRotate = setInterval(() => {
              setActive(prev => (prev + 1) % SLIDES.length)
            }, 2500)
          } else if (self.progress < ZOOM_DONE - 0.06 && fullyZoomed) {
            fullyZoomed = false
            gsap.to(border, { boxShadow: 'inset 0 0 0 0px #F5F2ED', duration: 0.3 })
            gsap.to(overlay, { opacity: 0, duration: 0.3 })
            gsap.to([prev, next], { opacity: 0, y: 16, duration: 0.3, pointerEvents: 'none' })
            if (autoRotate) { clearInterval(autoRotate); autoRotate = null }
            setActive(CENTER_INDEX)
          }
        },
      },
    })

    // Zoom phase
    tl.to(composition, { scale: finalScale, transformOrigin: 'center center', ease: 'power2.inOut', duration: 1 }, 0)
    // Dwell phase — duration proportional to DWELL_SCROLL so split is accurate
    tl.to({}, { duration: DWELL_SCROLL / ZOOM_SCROLL }, 1)

    return () => {
      tl.kill()
      if (autoRotate) clearInterval(autoRotate)
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
        <a
          href="https://maps.app.goo.gl/VR67EL9vxRoVgBXQA"
          target="_blank"
          rel="noopener noreferrer"
          className="location__map-btn"
        >
          <span className="btn-label-wrap">
            <span className="btn-label">OPEN IN GOOGLE MAPS</span>
            <span className="btn-label btn-label--alt">OPEN IN GOOGLE MAPS</span>
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M6.41667 2.33325H1.75V12.2499H11.6667V7.58325" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square"/>
            <path d="M8.75004 1.75H12.25V5.25M11.9584 2.04167L6.70837 7.29167" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square"/>
          </svg>

        </a>
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

        {/* Cream border: always visible above composition, below slide overlay */}
        <div ref={borderRef} className="location__border" />

        {/* Slider overlay: 40px inset from stage edges */}
        <div ref={overlayRef} className="location__overlay">
          {SLIDES.map((src, i) => (
            <div key={src} ref={el => { slideRefs.current[i] = el }} className="location__slide">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* Arrows centered vertically at image edges */}
        <button
          ref={prevRef}
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
          ref={nextRef}
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
    </section>
  )
}
