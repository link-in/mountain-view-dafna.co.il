'use client'

import portfolio10 from '@/assets/images/portfolio/img-10.png'
import portfolio11 from '@/assets/images/portfolio/img-11.png'
import portfolio12 from '@/assets/images/portfolio/img-12.png'
import portfolio13 from '@/assets/images/portfolio/img-13.png'
import portfolio14 from '@/assets/images/portfolio/img-14.png'
import portfolio15 from '@/assets/images/portfolio/img-15.png'
import portfolio16 from '@/assets/images/portfolio/img-16.png'
import portfolio17 from '@/assets/images/portfolio/img-17.png'
import portfolio9 from '@/assets/images/portfolio/img-9.png'
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
                  <GlightBox className="mfp-image" href={portfolio9.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio9} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio10.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio10} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio11.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio11} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio12.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio12} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio13.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio13} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio14.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio14} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio15.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio15} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={portfolio16.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio16} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Milk</p>
                        <h6 className="text-dark mt-1 text-uppercase">Sometime Active</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item design photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={portfolio17.src} title="Project Name">
                    <Image className="item-container img-fluid" src={portfolio17} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Pepers</p>
                        <h6 className="text-dark mt-1 text-uppercase">Therefore Always</h6>
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
