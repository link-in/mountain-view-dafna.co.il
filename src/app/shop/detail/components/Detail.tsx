'use client';

import img1 from '@/assets/images/shop/img-1.png'
import img2 from '@/assets/images/shop/img-2.png'
import img3 from '@/assets/images/shop/img-3.png'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Nav, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap'

const Detail = () => {
  return (
    <>
      <section className="section pb-0">
        <Container>
          <Row>
            <TabContainer defaultActiveKey={'img1'}>
              <Col lg={6}>
                <div className="prod-detai-imgs">
                  <Row>
                    <Col lg={3}>
                      <Nav className="flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <NavLink
                          eventKey={'img1'}
                          className="p-0"
                          id="product-1-tab"
                          data-toggle="pill"
                          href="#product-1"
                          role="tab"
                          aria-controls="product-1"
                          aria-selected="false">
                          <Image src={img1} alt="" className="img-fluid mx-auto d-block rounded" />
                        </NavLink>
                        <NavLink
                          eventKey={'img2'}
                          className="mt-4 p-0"
                          id="product-2-tab"
                          data-toggle="pill"
                          href="#product-2"
                          role="tab"
                          aria-controls="product-2"
                          aria-selected="false">
                          <Image src={img2} alt="" className="img-fluid mx-auto d-block rounded" />
                        </NavLink>
                        <NavLink
                          eventKey={'img3'}
                          className="mt-4 p-0"
                          id="product-3-tab"
                          data-toggle="pill"
                          href="#product-3"
                          role="tab"
                          aria-controls="product-3"
                          aria-selected="true">
                          <Image src={img3} alt="" className="img-fluid mx-auto d-block rounded" />
                        </NavLink>
                      </Nav>
                    </Col>
                    <Col lg={9}>
                      <TabContent id="v-pills-tabContent">
                        <TabPane eventKey={'img1'} className="fade" id="product-1" role="tabpanel">
                          <div>
                            <Image src={img1} alt="" className="img-fluid mx-auto d-block rounded" />
                          </div>
                        </TabPane>
                        <TabPane eventKey={'img2'} className="fade" id="product-2" role="tabpanel">
                          <div>
                            <Image src={img2} alt="" className="img-fluid mx-auto d-block rounded" />
                          </div>
                        </TabPane>
                        <TabPane eventKey={'img3'} className="fade" id="product-3" role="tabpanel">
                          <div>
                            <Image src={img3} alt="" className="img-fluid mx-auto d-block rounded" />
                          </div>
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </div>
              </Col>
            </TabContainer>
            <Col lg={6}>
              <div className="ps-5">
                <h4>Denim Jacket</h4>
                <h4 className="mt-4">
                  <b>$454.99</b>
                  <span className="text-muted mr-2 f-15 ps-4" />
                </h4>
                <p className="text-muted  mt-4 pt-2">
                  Differ in their grammar their pronunciation and their most common words everyone realizes why a new common language would be
                  translators.
                </p>
                <div className="mt-4">
                  <Icon icon="mdi:star" className="mdi" />
                  <Icon icon="mdi:star" className="mdi" />
                  <Icon icon="mdi:star" className="mdi" />
                  <Icon icon="mdi:star" className="mdi" />
                  <span className="text-muted ps-3">28 Reviews</span>
                </div>
                <h6 className="text-uppercase mt-4">UK Size</h6>
                <ul className="pagination mt-4">
                  <li className="next">
                    <Link href="">
                      <Icon icon="mdi:chevron-left" className="mdi" />
                    </Link>
                  </li>
                  <li className="active">
                    <Link href="">S</Link>
                  </li>
                  <li>
                    <Link href="">M</Link>
                  </li>
                  <li>
                    <Link href="">L</Link>
                  </li>
                  <li>
                    <Link href="">XL</Link>
                  </li>
                  <li>
                    <Link href="">XXl</Link>
                  </li>
                  <li className="prev">
                    <Link href="">
                      <Icon icon="mdi:chevron-right" className="mdi" />
                    </Link>
                  </li>
                </ul>
                <div className="mt-4 pt-3">
                  <Link href="" className="btn btn-md btn-dark-custom">
                    <Icon icon="mdi:cart" className="mdi" /> Add To Card
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Detail
