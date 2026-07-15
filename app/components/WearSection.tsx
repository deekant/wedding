'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const COOL_COLORS = ['#99a6b6', '#c8d2db', '#d5e7fd', '#e2eff7']
const WARM_COLORS = ['#cbb8b2', '#f2ebd8', '#ffeab1', '#fcf8d3']

function ColorDiamond({ colors }: { colors: string[] }) {
  return (
    <div className="wear__diamond">
      <div className="wear__diamond-inner">
        {colors.map((c) => (
          <div key={c} className="wear__dot" style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

export default function WearSection() {
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
    <section className="wear">
      <div className="container wear__inner">
        <h2 ref={titleRef} className="wear__title">
          What<br />to wear
        </h2>

        <div ref={contentRef} className="wear__body">
          <div className="wear__text">
            <p className="wear__para">
              We&rsquo;d love for guests to dress in smart casual or garden party attire. Think summer dresses, suits, and light fabrics.
            </p>
            <p className="wear__para">
              There&rsquo;s no strict dress code, so wear what makes you feel wonderful. The only rule? Leave the white dresses for the bride!
            </p>
          </div>

          <div className="wear__palette">
            <p className="wear__palette-title">Colour Kind Considerations</p>
            <div className="wear__diamonds">
              <ColorDiamond colors={COOL_COLORS} />
              <ColorDiamond colors={WARM_COLORS} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
