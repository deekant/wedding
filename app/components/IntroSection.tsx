'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'


export default function IntroSection() {
  const titleRef    = useRef<HTMLParagraphElement>(null)
  const eyebrowRef  = useRef<HTMLDivElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef= useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return

    const blurTween = gsap.fromTo(el,
      { filter: 'blur(8px)' },
      { filter: 'blur(0px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 30%', scrub: 1.2 } }
    )

    // Eyebrow: text fades in, lines expand from center outward
    let eyebrowTween: gsap.core.Tween | null = null
    let linesTween:   gsap.core.Tween | null = null
    if (eyebrowRef.current) {
      const trigger = { trigger: eyebrowRef.current, start: 'top 85%' }
      eyebrowTween = gsap.fromTo(eyebrowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: trigger }
      )
      linesTween = gsap.fromTo([lineLeftRef.current, lineRightRef.current],
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power2.out', delay: 0.2, scrollTrigger: trigger }
      )
    }

    return () => {
      blurTween.kill()
      eyebrowTween?.kill()
      linesTween?.kill()
    }
  }, [])

  return (
    <section className="intro">
      <div className="intro__inner">
        <div className="intro__text">
          <div ref={eyebrowRef} className="intro__eyebrow">
            <div ref={lineLeftRef} className="intro__eyebrow-line intro__eyebrow-line--left" />
            <span className="intro__eyebrow-label">We&#39;re Getting Married!</span>
            <div ref={lineRightRef} className="intro__eyebrow-line intro__eyebrow-line--right" />
          </div>

          <p ref={titleRef} className="intro__quote">
            We can&#39;t wait to celebrate this beautiful day surrounded by the people we love most
          </p>

          <p className="intro__subtext">Join us for an evening of vows, dinner, and dancing above it all.</p>
        </div>

        <button
          className="intro__cta"
          onClick={() => {
            const cta = document.querySelector('.cta')
            ;(window as any).__lenis?.scrollTo(cta)
          }}
        >
          <span className="btn-label-wrap intro__cta-label">
            <span className="btn-label">RSVP BY 15 AUGUST, 2026</span>
            <span className="btn-label btn-label--alt">RSVP BY 15 AUGUST, 2026</span>
          </span>
        </button>
      </div>
    </section>
  )
}
