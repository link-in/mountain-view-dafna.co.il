'use client'
import img1 from '@/assets/images/portfolio/img-1.png'
import img11 from '@/assets/images/portfolio/img-11.png'
import img12 from '@/assets/images/portfolio/img-12.png'
import img13 from '@/assets/images/portfolio/img-13.png'
import img14 from '@/assets/images/portfolio/img-14.png'
import img15 from '@/assets/images/portfolio/img-15.png'
import img16 from '@/assets/images/portfolio/img-16.png'
import img4 from '@/assets/images/portfolio/img-4.png'
import img5 from '@/assets/images/portfolio/img-5.png'
import img6 from '@/assets/images/portfolio/img-6.png'
import img7 from '@/assets/images/portfolio/img-7.png'
import img8 from '@/assets/images/portfolio/img-8.png'
import img9 from '@/assets/images/portfolio/img-9.png'
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
            <div className="portfolioContainer row " data-isotope='{ "layoutMode": "masonry" }'>
              <Col lg={4} className="p-4 grid-item photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={img1.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img1} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img9.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img9} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img7.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img7} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img5.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img5} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img11.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img11} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img4.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img4} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img12.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img12} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img6.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img6} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Milk</p>
                        <h6 className="text-dark mt-1 text-uppercase">Sometime Active</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={img8.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img8} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img14.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img14} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img15.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img15} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Pepers</p>
                        <h6 className="text-dark mt-1 text-uppercase">Therefore Always</h6>
                      </div>
                    </div>
                  </GlightBox>
                </div>
              </Col>
              <Col lg={4} className="p-4 grid-item branding design photo">
                <div className="item-box">
                  <GlightBox className="mfp-image" href={img13.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img13} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img5.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img5} alt="work-img" />
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
                  <GlightBox className="mfp-image" href={img16.src} title="Project Name">
                    <Image className="item-container img-fluid" src={img16} alt="work-img" />
                    <div className="item-mask">
                      <div className="item-caption">
                        <p className="text-dark mb-0">Bottle</p>
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
