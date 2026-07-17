'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'


export default function GallerySection() {
  const leftImgRef   = useRef<HTMLDivElement>(null)
  const rightColRef  = useRef<HTMLDivElement>(null)
  const rightImgRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tweens: gsap.core.Tween[] = []
    const isMobile = window.innerWidth < 768
    const leftOffset  = isMobile ? 40  : 120
    const colOffset   = isMobile ? 40  : 120
    const rightOffset = isMobile ? 30  : 100

    if (leftImgRef.current) {
      tweens.push(gsap.fromTo(leftImgRef.current,
        { y: leftOffset },
        { y: -leftOffset, ease: 'none', scrollTrigger: { trigger: leftImgRef.current.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
      ))
    }

    // Right column moves up faster than left (vertical offset on scroll)
    if (rightColRef.current) {
      tweens.push(gsap.fromTo(rightColRef.current,
        { y: colOffset },
        { y: -colOffset, ease: 'none', scrollTrigger: { trigger: rightColRef.current.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
      ))
    }

    if (rightImgRef.current) {
      tweens.push(gsap.fromTo(rightImgRef.current,
        { y: rightOffset },
        { y: -rightOffset, ease: 'none', scrollTrigger: { trigger: rightImgRef.current.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
      ))
    }

    return () => { tweens.forEach(t => t.kill()) }
  }, [])

  return (
    <section className="gallery">
      <div className="gallery__grid">
        <div className="gallery__item gallery__item--left">
          <div ref={leftImgRef} className="gallery__img-inner">
            <Image
              src="/gallery-01.jpg"
              alt="Vadym & Mariya"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div ref={rightColRef} className="gallery__col">
          <div className="gallery__item gallery__item--right">
            <div ref={rightImgRef} className="gallery__img-inner">
              <Image
                src="/gallery-02.jpg"
                alt="Warsaw"
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover"
              />
            </div>
          </div>
          <p className="gallery__caption">Warsaw — Where It All Happens</p>
        </div>
      </div>
    </section>
  )
}
