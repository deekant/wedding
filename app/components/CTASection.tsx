'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function CTASection() {
  const [attending, setAttending] = useState<'yes' | 'no' | null>(null)
  const [guests, setGuests]       = useState(1)
  const cardRef                   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const tween = gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%' } }
    )
    return () => { tween.kill() }
  }, [])

  return (
    <section className="cta">
      <div className="cta__scene">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/cta-bg.jpg" alt="" className="cta__scene-bg" />
        <div className="cta__scene-overlay" />

        <div ref={cardRef} className="cta__card">
          <div className="cta__header">
            <h2 className="cta__title">
              We Can&rsquo;t Wait to Celebrate<br />This Special Day With You
            </h2>
            <p className="cta__subtitle">
              Please RSVP by 15 August, 2026, so we can finalize seating and catering
            </p>
          </div>

          <form className="cta__form" onSubmit={e => e.preventDefault()}>
            <div className="cta__field">
              <label className="cta__label">Full name</label>
              <input className="cta__input" type="text" />
            </div>

            <div className="cta__field">
              <label className="cta__label">Will you attend?</label>
              <div className="cta__attend-btns">
                <button
                  type="button"
                  className={`cta__attend-btn${attending === 'yes' ? ' cta__attend-btn--active' : ''}`}
                  onClick={() => setAttending('yes')}
                >
                  I will come
                </button>
                <button
                  type="button"
                  className={`cta__attend-btn${attending === 'no' ? ' cta__attend-btn--active' : ''}`}
                  onClick={() => setAttending('no')}
                >
                  I can&rsquo;t come
                </button>
              </div>
            </div>

            <div className="cta__field">
              <label className="cta__label">
                Number of Guests <span className="cta__label-sub">(including you)</span>
              </label>
              <input
                className="cta__input"
                type="number"
                min={1}
                value={guests}
                onChange={e => setGuests(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className="cta__field">
              <label className="cta__label">Dietary Restrictions / Allergies</label>
              <input className="cta__input" type="text" />
            </div>

            <div className="cta__field">
              <label className="cta__label">
                Telegram Username <span className="cta__label-sub">(for the guest group)</span>
              </label>
              <input className="cta__input" type="text" placeholder="@yournickname" />
            </div>

            <button type="submit" className="cta__submit">Send RSVP</button>
          </form>
        </div>
      </div>
    </section>
  )
}
