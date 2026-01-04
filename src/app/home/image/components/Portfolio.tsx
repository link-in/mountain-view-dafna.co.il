'use client'

import portfolio1 from '@/assets/images/portfolio/img-1.png'
import portfolio2 from '@/assets/images/portfolio/img-2.png'
import portfolio3 from '@/assets/images/portfolio/img-3.png'
import portfolio4 from '@/assets/images/portfolio/img-4.png'
import portfolio5 from '@/assets/images/portfolio/img-5.png'
import portfolio6 from '@/assets/images/portfolio/img-6.png'
import portfolio7 from '@/assets/images/portfolio/img-7.png'
import portfolio8 from '@/assets/images/portfolio/img-8.png'
import GlightBox from '@/components/GlightBox'
import Image from 'next/image'
import { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Portfolio = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/helpers/init-isotope').then(({ initIsotope }) => {
        initIsotope()
      })
    }
  }, [])
  return (
    <>
      <section className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <ul className="col container-filter portfolioFilte list-unstyled mb-0 grid-menu" data-target=".portfolioContainer" id="filter">
                  <li>
                    <a className="categories active" data-filter="*">
                      All
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".branding">
                      Branding
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".design">
                      Design
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".photo">
                      Photo
                    </a>
                  </li>
                  <li>
                    <a className="categories" data-filter=".coffee">
                      coffee
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
          <div className="port portfolio-masonry mt-4">
            <div className="portfolioContainer row" data-isotope='{ "layoutMode": "masonry" }'>
              <Col lg={4} className="p-4 grid-item photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio1.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio1} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Branding</p>
                        <h6 className="text-dark mt-1 text-uppercase">Nonsensical content</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding coffee">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio8.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio8} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Coffee</p>
                        <h6 className="text-dark mt-1 text-uppercase">PageMaker including</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio5.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio5} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Lebles</p>
                        <h6 className="text-dark mt-1 text-uppercase">Sometime Active</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding design photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio2.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio2} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Card</p>
                        <h6 className="text-dark mt-1 text-uppercase">Therefore Always</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item design photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio3.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio3} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Pepers</p>
                        <h6 className="text-dark mt-1 text-uppercase">Therefore Always</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding design coffee">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio7.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio7} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Bottle</p>
                        <h6 className="text-dark mt-1 text-uppercase">Therefore Always</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding design">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio4.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio4} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Watch</p>
                        <h6 className="text-dark mt-1 text-uppercase">Sometime Active</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding design photo coffee">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio6.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio6} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Milk</p>
                        <h6 className="text-dark mt-1 text-uppercase">Sometime Active</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default Portfolio
