'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const DURATION = 4000

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function Fireworks() {
  useEffect(() => {
    const animationEnd = Date.now() + DURATION
    const defaults = { startVelocity: 15, spread: 360, ticks: 120, zIndex: 9999, gravity: 0.5 }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)

      const particleCount = 50 * (timeLeft / DURATION)

      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      }))
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      }))
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return null
}
