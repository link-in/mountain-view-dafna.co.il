import React from 'react'
import spaceship from '@/assets/images/icons/spaceship.png'
import growing from '@/assets/images/icons/growing.png'
import Image from 'next/image'
import clownhat from '@/assets/images/icons/clownhat.png'
import { Col, Container, Row } from 'react-bootstrap'
import Link from 'next/link'

const Pricing = () => {
  return (
    <>
      <section className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <h2>
                  <span className="font-weight-300">Our</span> Pricing
                </h2>
                <p className="text-muted mt-3">
                  Pharetra ipsum dignissim fermentum donec dolor tellus sodales pretium eget velit
                  <br /> maecenas egestas massa sollicitudin rhoncus.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={4}>
              <div className="pricing-box mt-4 p-5 text-center border rounded">
                <div className="services-img">
                  <Image src={spaceship} width={50} height={50} className="img-fluid" alt="" />
                </div>
                <h6 className="text-uppercase mt-4 pt-2">Basic</h6>
                <h1 className="mt-4 pt-2">
                  <sup className="f-20">$ </sup>35 <small className="f-16">/ month</small>
                </h1>
                <div className="mt-4 pt-2">
                  <p className="text-muted mb-2">Free Setup</p>
                  <p className="text-muted mb-2">20 GB Storage</p>
                  <p className="text-muted mb-2">Unlmited Users</p>
                  <p className="text-muted mb-2">SEO optimization</p>
                  <p className="text-muted mb-2">Customer Support</p>
                </div>
                <div className="mt-4 pt-2 text-center">
                  <Link href="" className="btn btn-outline-dark btn-round">
                    Join Now
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={4}>
              <div className="pricing-box mt-4 p-5 text-center border rounded">
                <div className="services-img">
                  <Image src={growing} width={50} height={50} className="img-fluid" alt="" />
                </div>
                <h6 className="text-uppercase mt-4 pt-2">Standard</h6>
                <h1 className="mt-4 pt-2">
                  <sup className="f-20">$ </sup>70 <small className="f-16">/ month</small>
                </h1>
                <div className="mt-4 pt-2">
                  <p className="text-muted mb-2">Free Setup</p>
                  <p className="text-muted mb-2">20 GB Storage</p>
                  <p className="text-muted mb-2">Unlmited Users</p>
                  <p className="text-muted mb-2">SEO optimization</p>
                  <p className="text-muted mb-2">Customer Support</p>
                </div>
                <div className="mt-4 pt-2 text-center">
                  <Link href="" className="btn btn-dark-custom btn-round">
                    Join Now
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={4}>
              <div className="pricing-box mt-4 p-5 text-center border rounded">
                <div className="services-img">
                  <Image src={clownhat} width={50} height={50} className="img-fluid" alt="" />
                </div>
                <h6 className="text-uppercase mt-4 pt-2">Unlimited</h6>
                <h1 className="mt-4 pt-2">
                  <sup className="f-20">$ </sup>99 <small className="f-16">/ month</small>
                </h1>
                <div className="mt-4 pt-2">
                  <p className="text-muted mb-2">Free Setup</p>
                  <p className="text-muted mb-2">20 GB Storage</p>
                  <p className="text-muted mb-2">Unlmited Users</p>
                  <p className="text-muted mb-2">SEO optimization</p>
                  <p className="text-muted mb-2">Customer Support</p>
                </div>
                <div className="mt-4 pt-2 text-center">
                  <Link href="" className="btn btn-outline-dark btn-round">
                    Join Now
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

export default Pricing
