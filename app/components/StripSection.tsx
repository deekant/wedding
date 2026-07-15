'use client'

const IMAGES = [
  '/strip-01.jpg',
  '/strip-02.jpg',
  '/strip-03.jpg',
  '/strip-04.jpg',
  '/strip-05.jpg',
  '/strip-06.jpg',
  '/strip-07.jpg',
  '/strip-08.jpg',
  '/strip-09.jpg',
]

export default function StripSection() {
  const doubled = [...IMAGES, ...IMAGES]
  return (
    <section className="strip">
      <div className="strip__track">
        {doubled.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="strip__img" />
        ))}
      </div>
    </section>
  )
}
