import earth from '@/assets/images/icons/earth.png'
import mobilepay from '@/assets/images/icons/mobilepay.png'
import spaceship from '@/assets/images/icons/spaceship.png'
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
                <div className="services-img">
                  <Image width={50} height={50} className="img-fluid" src={spaceship} alt="" />
                </div>
                <h6 className="mt-4">4514 West Street Helena</h6>
              </div>
            </Col>
            <Col lg={4}>
              <div className="text-center mt-4">
                <div className="services-img">
                  <Image width={50} height={50} className="img-fluid" src={mobilepay} alt="" />
                </div>
                <h6 className="mt-4">+001 406-471-0400</h6>
              </div>
            </Col>
            <Col lg={4}>
              <div className="text-center mt-4">
                <div className="services-img">
                  <Image width={50} height={50} className="img-fluid" src={earth} alt="" />
                </div>
                <h6 className="mt-4">Candiarity@joapide.com</h6>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Contact
