'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const GIFTS = [
  {
    title: 'A Good Book',
    desc: "One of your favourites, or one you think we'd love.",
    link: null,
  },
  {
    title: 'A Bottle to Share',
    desc: 'Wine, whiskey, or champagne for a toast later.',
    link: null,
  },
  {
    title: 'A Flower Subscription',
    desc: 'Fresh flowers for our new home, on repeat.',
    link: { label: 'ORDER HERE', href: '#' },
  },
  {
    title: 'A Contribution',
    desc: 'Monetary gifts are welcome too, with our thanks.',
    link: null,
  },
]

export default function GiftSection() {
  const titleRef   = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tweens: gsap.core.Tween[] = []

    if (titleRef.current) {
      tweens.push(gsap.fromTo(titleRef.current,
        { filter: 'blur(8px)' },
        { filter: 'blur(0px)', ease: 'none',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', end: 'top 30%', scrub: 1.2 } }
      ))
    }

    if (contentRef.current) {
      tweens.push(gsap.fromTo(contentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: contentRef.current, start: 'top 80%' } }
      ))
    }

    return () => { tweens.forEach(t => t.kill()) }
  }, [])

  return (
    <section className="gift">
      <div className="container gift__inner">
        <h2 ref={titleRef} className="gift__title">
          Instead<br />of flowers
        </h2>

        <div ref={contentRef} className="gift__body">
          <p className="gift__intro">
            Your presence is the present — and we kindly ask for no flowers. If you&rsquo;d like to bring something, here is what we&rsquo;d truly love:
          </p>

          <ul className="gift__list">
            {GIFTS.map((g) => (
              <li key={g.title} className="gift__item">
                <div className="gift__item-text">
                  <p className="gift__item-title">{g.title}</p>
                  <p className="gift__item-desc">{g.desc}</p>
                </div>
                {g.link && (
                  <a href={g.link.href} className="gift__link" target="_blank" rel="noopener noreferrer">
                    <span>{g.link.label}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 13L13 3M13 3H7M13 3V9" stroke="#100802" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
