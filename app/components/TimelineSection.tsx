'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'


const EVENTS = [
  {
    time: '15:00',
    title: 'Welcome Drink',
    description: 'Glasses of prosecco await — join us on the terrace for light bites and great company',
    image: '/timeline-01.jpg',
  },
  {
    time: '16:00',
    title: 'Ceremony',
    description: 'We gather in the gardens of Cicha 23 for the ceremony',
    image: '/timeline-02.jpg',
  },
  {
    time: '17:00',
    title: 'Banquet',
    description: 'Featuring a sumptuous dinner, heartfelt toasts, and captivating stories shared among friends',
    image: '/timeline-03.jpg',
  },
  {
    time: '19:30',
    title: 'First Dance',
    description: "Celebrate the newlyweds' first dance with music and joy",
    image: '/timeline-04.jpg',
  },
  {
    time: '21:30',
    title: 'Wedding Cake',
    description: 'Time to cut the cake! Followed by coffee, tea, and an obscene amount of petit fours',
    image: '/timeline-05.jpg',
  },
]

// Stack state per depth position (0 = active/front)
const STACK = [
  { rotation: 0,   x: 0,   y: 0,  scale: 1,    opacity: 1 },
  { rotation: -5,  x: 14,  y: 20, scale: 0.96, opacity: 1 },
  { rotation: 3,   x: -12, y: 38, scale: 0.92, opacity: 1 },
  { rotation: -3,  x: 9,   y: 55, scale: 0.88, opacity: 1 },
  { rotation: 2,   x: -6,  y: 70, scale: 0.84, opacity: 1 },
]

export default function TimelineSection() {
  const titleRef  = useRef<HTMLHeadingElement>(null)
  const stageRef  = useRef<HTMLDivElement>(null)
  const cardRefs        = useRef<(HTMLDivElement | null)[]>([])
  const textPanelRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const title = titleRef.current
    const stage = stageRef.current
    if (!stage) return

    const cards  = cardRefs.current.filter(Boolean)  as HTMLDivElement[]
    const panels = textPanelRefs.current.filter(Boolean) as HTMLDivElement[]
    if (cards.length !== EVENTS.length || panels.length !== EVENTS.length) return

    let blurTween: gsap.core.Tween | null = null
    if (title) {
      blurTween = gsap.fromTo(title,
        { filter: 'blur(8px)' },
        { filter: 'blur(0px)', ease: 'none', scrollTrigger: { trigger: title, start: 'top 85%', end: 'top 25%', scrub: 1.2 } }
      )
    }

    cards.forEach((card, i) => {
      gsap.set(card, { ...STACK[i], zIndex: EVENTS.length - i })
    })

    // Text column is height:0; yPercent:-50 centers each absolute panel on the flex row midline
    panels.forEach((panel, i) => {
      gsap.set(panel, {
        yPercent: -50,
        y:        i === 0 ? 0 : 60,
        opacity:  i === 0 ? 1 : 0,
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage,
        pin: true,
        start: 'top top',
        end: `+=${(EVENTS.length - 1) * 900}`,
        scrub: 1.5,
      },
    })

    for (let i = 0; i < EVENTS.length - 1; i++) {
      const t = i

      // Active card exits — throws upper-left with rotation
      tl.fromTo(cards[i],
        { ...STACK[0] },
        { rotation: -20, x: -700, y: -80, opacity: 0, scale: 1, duration: 1, ease: 'power2.inOut' },
        t,
      )

      // Next card rises to active position
      tl.fromTo(cards[i + 1],
        { ...STACK[1] },
        { ...STACK[0], duration: 1, ease: 'power2.out' },
        t,
      )

      // Remaining cards shuffle one step toward front
      for (let j = i + 2; j < EVENTS.length; j++) {
        tl.fromTo(cards[j],
          { ...STACK[j - i] },
          { ...STACK[j - i - 1], duration: 1 },
          t,
        )
      }

      // Text: current panel slides up and fades out
      tl.fromTo(panels[i],
        { y: 0, opacity: 1 },
        { y: -50, opacity: 0, duration: 0.55 },
        t,
      )

      // Text: next panel slides up into view
      tl.fromTo(panels[i + 1],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        t + 0.28,
      )
    }

    return () => {
      blurTween?.kill()
      tl.kill()
    }
  }, [])

  return (
    <section className="timeline">
      <div className="timeline__header">
        <h2 ref={titleRef} className="timeline__title">
          The day, from<br />the beginning
        </h2>
      </div>

      <div ref={stageRef} className="timeline__stage">
        <div className="timeline__deck-wrapper">
          <div className="timeline__deck">
            {EVENTS.map((event, i) => (
              <div
                key={event.image}
                ref={el => { cardRefs.current[i] = el }}
                className="timeline__card"
              >
                <Image src={event.image} alt={event.title} fill className="object-cover" priority={i === 0} />
              </div>
            ))}
          </div>

          <div className="timeline__text-col">
            {EVENTS.map((event, i) => (
              <div key={event.time} ref={el => { textPanelRefs.current[i] = el }} className="timeline__panel">
                <span className="timeline__panel-time">{event.time}</span>
                <p className="timeline__panel-name">{event.title}</p>
                <p className="timeline__panel-desc">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
