'use client'

import 'glightbox/dist/css/glightbox.min.css'
import Link from 'next/link'
import { useEffect, useRef, type AnchorHTMLAttributes } from 'react'

const GlightBox = ({ children, href, ...other }: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const ref = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    let instance: any = null

    import('glightbox').then(({ default: GLightbox }) => {
      if (ref.current) {
        instance = GLightbox({
          selector: '.glightbox',
          openEffect: 'fade',
          closeEffect: 'fade',
        })
      }
    })

    return () => {
      instance?.destroy()
    }
  }, [])

  return (
    <Link ref={ref} href={href} {...other} className={`glightbox ${other['className'] ?? ''}`}>
      {children}
    </Link>
  )
}

export default GlightBox
