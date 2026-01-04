'use client'
import living_room1 from '@/assets/photos/living_room/img_2242.jpg'
import living_room2 from '@/assets/photos/living_room/img_2244.jpg'
import living_room3 from '@/assets/photos/living_room/img_2247.jpg'
import living_room4 from '@/assets/photos/living_room/img_2251.jpg'
import living_room5 from '@/assets/photos/living_room/img_2278.jpg'
import living_room6 from '@/assets/photos/living_room/img_2285.jpg'
import living_room7 from '@/assets/photos/living_room/img_2287.jpg'
import living_room8 from '@/assets/photos/living_room/img_2312.jpg'
import living_room9 from '@/assets/photos/living_room/img_2315.jpg'
import living_room10 from '@/assets/photos/living_room/img_2326.jpg'
import master_bedroom1 from '@/assets/photos/master_bedroom/img_2260.jpg'
import master_bedroom2 from '@/assets/photos/master_bedroom/img_2268.jpg'
import master_bedroom3 from '@/assets/photos/master_bedroom/img_2269.jpg'
import master_bedroom4 from '@/assets/photos/master_bedroom/img_2336.jpg'
import porch1 from '@/assets/photos/porch/img_2253.jpg'
import porch2 from '@/assets/photos/porch/img_2254.jpg'
import porch3 from '@/assets/photos/porch/img_2255.jpg'
import porch4 from '@/assets/photos/porch/img_2330.jpg'
import extra_room1 from '@/assets/photos/extra_room/img_2238.jpg'
import extra_room2 from '@/assets/photos/extra_room/img_2301.jpg'

import GlightBox from '@/components/GlightBox'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

interface PortfolioItem {
  image: any
  category: string
  categoryName: string
  title: string
}

const Portfolio = () => {
  // מערך כל התמונות - ללא ערבוב כדי למנוע hydration mismatch
  const baseImages: PortfolioItem[] = useMemo(() => [
    { image: living_room1, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room2, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room3, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room4, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room5, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room6, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room7, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room8, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room9, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: living_room10, category: 'living_room', categoryName: 'חלל משותף', title: 'living_room' },
    { image: master_bedroom1, category: 'master_bedroom', categoryName: 'יחידת הורים', title: 'master_bedroom' },
    { image: master_bedroom2, category: 'master_bedroom', categoryName: 'יחידת הורים', title: 'master_bedroom' },
    { image: master_bedroom3, category: 'master_bedroom', categoryName: 'יחידת הורים', title: 'master_bedroom' },
    { image: master_bedroom4, category: 'master_bedroom', categoryName: 'יחידת הורים', title: 'master_bedroom' },
    { image: porch1, category: 'porch', categoryName: 'המרפסת שלנו', title: 'porch' },
    { image: porch2, category: 'porch', categoryName: 'המרפסת שלנו', title: 'porch' },
    { image: porch3, category: 'porch', categoryName: 'המרפסת שלנו', title: 'porch' },
    { image: porch4, category: 'porch', categoryName: 'המרפסת שלנו', title: 'porch' },
    { image: extra_room1, category: 'extra_room', categoryName: 'חדר נוסף', title: 'extra_room' },
    { image: extra_room2, category: 'extra_room', categoryName: 'חדר נוסף', title: 'extra_room' },
  ], [])

  // ערך ראשוני קבוע - 12 תמונות ראשונות (ללא ערבוב) כדי למנוע hydration mismatch
  const initialImages = useMemo(() => baseImages.slice(0, 12), [baseImages])
  const [allImages, setAllImages] = useState<PortfolioItem[]>(initialImages)

  // ערבוב אקראי רק בצד הלקוח אחרי hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shuffled = [...baseImages].sort(() => Math.random() - 0.5)
      setAllImages(shuffled.slice(0, 12))
    }
  }, [baseImages])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/helpers/init-isotope').then(({ initIsotope }) => {
        initIsotope()
      })
    }
  }, [])
  return (
    <>
      <section id="portfolio-gallery" className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <ul className="col container-filter portfolioFilte list-unstyled mb-0 grid-menu" data-target=".portfolioContainer" id="filter">
                  <li>
                    <a className="categories active" data-filter="*">
                      הכל
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".living_room">
                      חלל משותף
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".master_bedroom">
                      יחידת הורים
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".porch">
                      המרפסת שלנו
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".extra_room">
                      חדר נוסף
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="port portfolio-masonry mt-4">
            <div className="portfolioContainer row" data-isotope='{ "layoutMode": "masonry" }'>
              {allImages.map((item, index) => (
                <Col key={index} lg={4} md={6} sm={6} xs={12} className={`p-4 grid-item ${item.category}`}>
                  <div className="item-box">
                    <GlightBox className="mfp-image" href={item.image.src} title={item.title}>
                      <Image className="item-container img-fluid" src={item.image} alt={item.title} />
                      <div className="item-mask">
                        <div className="item-caption">
                          <p className="text-dark mb-0">{item.categoryName}</p>
                          <h6 className="text-dark mt-1 text-uppercase">{item.title}</h6>
                        </div>
                      </div>
                    </GlightBox>
                  </div>
                </Col>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default Portfolio
