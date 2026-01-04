import earth from '@/assets/images/icons/earth.png'
import mobilepay from '@/assets/images/icons/mobilepay.png'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'

const Contact = () => {
  return (
    <>
     <section className="section bg-light">
            <Container>
              <Row>
                <Col lg={4}>
                  <div className="text-center mt-4">
                    <div className="services-img" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Icon icon="mdi:map-marker" style={{ fontSize: '50px', color: '#2e2e2e' }} />
                    </div>
                    <h6 className="mt-4">קיבוץ דפנה</h6>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="text-center mt-4">
                    <div className="services-img">
                      <Image width={50} height={50} className="img-fluid" src={mobilepay} alt="" />
                    </div>
                    <h6 className="mt-4">052-8676516</h6>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="text-center mt-4">
                    <div className="services-img">
                      <Image width={50} height={50} className="img-fluid" src={earth} alt="" />
                    </div>
                    <h6 className="mt-4">zurbracha@gmail.com</h6>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
    </>
  )
}

export default Contact
