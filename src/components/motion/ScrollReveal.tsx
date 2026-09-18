'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '@/lib/lenis'

export function ScrollReveal() {
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    // Bridge Lenis → ScrollTrigger so pin/scrub reads the smoothed scroll
    const lenis = getLenis()
    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)
    const tickerHandler = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerHandler)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      // Simple reveal
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        })
      })

      // Stagger reveal (children of [data-reveal-stagger])
      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]')
        if (items.length === 0) return
        gsap.from(items, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: group,
            start: 'top 80%',
            once: true,
          },
        })
      })

      // Parallax for [data-parallax] with optional data-parallax-speed
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed || '0.25')
        gsap.to(el, {
          yPercent: -speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => {
      ctx.revert()
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tickerHandler)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return null
}
