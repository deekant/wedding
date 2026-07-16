'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Fireworks from './Fireworks'

export default function CTASection() {
  const [attending, setAttending] = useState<'yes' | 'no' | null>('yes')
  const [guests, setGuests]       = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const sectionRef    = useRef<HTMLElement>(null)
  const cardRef       = useRef<HTMLDivElement>(null)
  const fromHeightRef = useRef<number | null>(null)

  // Capture height before re-render, animate after
  const captureHeight = () => {
    fromHeightRef.current = cardRef.current?.getBoundingClientRect().height ?? null
  }

  useLayoutEffect(() => {
    const card = cardRef.current
    const from = fromHeightRef.current
    if (!card || from === null) return
    fromHeightRef.current = null

    gsap.fromTo(card,
      { height: from },
      { height: card.scrollHeight, duration: 0.5, ease: 'power2.inOut',
        onComplete: () => gsap.set(card, { clearProps: 'height' }) }
    )
  }, [attending, submitted])

  useEffect(() => {
    const section = sectionRef.current
    const card    = cardRef.current
    if (!section || !card) return

    gsap.set(section, { padding: 0 })

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter:      () => gsap.to(section, { padding: 40, duration: 0.8, ease: 'power2.out' }),
      onLeave:      () => gsap.to(section, { padding: 0,  duration: 0.6, ease: 'power2.in'  }),
      onEnterBack:  () => gsap.to(section, { padding: 40, duration: 0.8, ease: 'power2.out' }),
      onLeaveBack:  () => gsap.to(section, { padding: 0,  duration: 0.6, ease: 'power2.in'  }),
    })

    const fadeTween = gsap.fromTo(card,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' } }
    )

    return () => { st.kill(); fadeTween.kill() }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    captureHeight()
    setSubmitted(true)
  }

  return (
    <section ref={sectionRef} className="cta">
      <div className="cta__scene">
        <Image src="/cta-bg.jpg" alt="" fill className="cta__scene-bg" style={{ objectFit: 'cover' }} sizes="100vw" />
        <div className="cta__scene-overlay" />

        <div ref={cardRef} className="cta__card">
          {submitted && attending === 'yes' && createPortal(<Fireworks />, document.body)}

          {submitted ? (
            <div className={`cta__success${attending === 'yes' ? ' cta__success--yes' : ''}`}>
              <h2 className="cta__success-title">
                {attending === 'yes' ? 'See you there!' : 'We\'ll miss you.'}
              </h2>
              <p className="cta__success-text">
                {attending === 'yes'
                  ? 'Your RSVP is in — we\'re so excited you\'ll be with us. September 14th can\'t come soon enough. Get ready for a beautiful day!'
                  : 'Thank you for letting us know. Even from afar, you\'ll be in our hearts on the day. We hope our paths cross again soon.'}
              </p>
              {attending === 'yes' && (
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta__success-link"
                >
                  JOIN TELEGRAM GROUP
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="cta__header">
                <h2 className="cta__title">Will you join us?</h2>
                <p className="cta__subtitle">
                  Please let us know by 15 August 2026 so we can finalize seating and catering. We'd love to see you there!
                </p>
              </div>

              <form className="cta__form" onSubmit={handleSubmit}>
                <div className="cta__field">
                  <label className="cta__label">Full name</label>
                  <input className="cta__input" type="text" required />
                </div>

                <div className="cta__field">
                  <label className="cta__label">Will you attend?</label>
                  <div className="cta__attend-btns">
                    <button
                      type="button"
                      className={`cta__attend-btn${attending === 'yes' ? ' cta__attend-btn--active' : ''}`}
                      onClick={() => { captureHeight(); setAttending('yes') }}
                    >
                      I will come
                    </button>
                    <button
                      type="button"
                      className={`cta__attend-btn${attending === 'no' ? ' cta__attend-btn--active' : ''}`}
                      onClick={() => { captureHeight(); setAttending('no') }}
                    >
                      I can&rsquo;t come
                    </button>
                  </div>
                </div>

                {attending === 'yes' && (
                  <>
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
                      <label className="cta__label">Dietary Restrictions <span className="cta__label-sub">(optional)</span></label>
                      <input className="cta__input" type="text" placeholder="Vegetarian, allergies..." />
                    </div>

                    <div className="cta__field">
                      <label className="cta__label">
                        Telegram Username <span className="cta__label-sub">(for the guest group)</span>
                      </label>
                      <input className="cta__input" type="text" placeholder="@yournickname" />
                    </div>
                  </>
                )}

                {attending !== null && (
                  <div className="cta__field">
                    <label className="cta__label">
                      A note for us <span className="cta__label-sub">(optional)</span>
                    </label>
                    <textarea className="cta__textarea" placeholder="Leave a note or well wishes" rows={4} />
                  </div>
                )}

                {attending !== null && (
                  <button type="submit" className="cta__submit">
                    <span className="btn-label-wrap">
                      <span className="btn-label">SEND RSVP</span>
                      <span className="btn-label btn-label--alt">SEND RSVP</span>
                    </span>
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
