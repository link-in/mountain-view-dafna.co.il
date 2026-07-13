'use client'

import useScrollEvent from '@/hook/useScrollEvent'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Container } from 'react-bootstrap'

interface MenuItem {
  title: string
  href: string
}

/** ניווט לסקשנים בדף הבית בלבד — בלי קישורי דמו מתבנית */
const menuData: MenuItem[] = [
  { title: 'בית', href: '/' },
  { title: 'גלריה', href: '/#portfolio-gallery' },
]

const Header = () => {
  const { scrollY } = useScrollEvent()
  const [navOpen, setNavOpen] = useState(false)
  const toggleNav = () => setNavOpen(!navOpen)

  return (
    <>
      <header id="topnav" className={`defaultscroll fixed-top navbar-sticky bg-white border-bottom ${scrollY > 100 && 'darkheader'}`}>
        <Container>
          <div>
            <Link href="/" className="logo">
              נוף הרים בדפנה
            </Link>
          </div>
          <div className="menu-extras">
            <div className="menu-item">
              {/* לוגו במובייל במקום כפתור התפריט */}
              <div className="mobile-logo" style={{ display: 'none' }}>
                <Link href="/">
                  <Image
                    src="/photos/logo.png"
                    alt="נוף הרים בדפנה"
                    width={120}
                    height={60}
                    style={{ objectFit: 'contain', width: '100%' }}
                  />
                </Link>
              </div>
              {/* כפתור תפריט (מוסתר במובייל) */}
              <Link
                href="/"
                className={`navbar-toggle ${navOpen ? 'open' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  toggleNav()
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="lines">
                  <span />
                  <span />
                  <span />
                </div>
              </Link>
            </div>
          </div>
          <div id="navigation" className={`${navOpen ? 'open' : ''}`}>
            <ul className="navigation-menu">
              {menuData.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setNavOpen(false)}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </header>
    </>
  )
}

export default Header
