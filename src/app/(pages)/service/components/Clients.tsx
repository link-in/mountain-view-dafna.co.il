import client1 from '@/assets/images/client-logo/img-1.png'
import client2 from '@/assets/images/client-logo/img-2.png'
import client3 from '@/assets/images/client-logo/img-3.png'
import client4 from '@/assets/images/client-logo/img-4.png'
import client5 from '@/assets/images/client-logo/img-5.png'
import client6 from '@/assets/images/client-logo/img-6.png'
import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'

const Clients = () => {
  return (
    <>
      <section className="section pt-0">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-4">
                <h2>
                  <span className="font-weight-300">Our</span> Clients
                </h2>
                <p className="text-muted mt-3">
                  Pharetra ipsum dignissim fermentum donec dolor tellus sodales pretium eget velit
                  <br /> maecenas egestas massa sollicitudin rhoncus.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={2}>
              <div className="client-box mt-4 text-center">
                <Image src={client1} className="img-fluid" alt="" />
              </div>
            </Col>
            <Col lg={2}>
              <div className="client-box mt-4 text-center">
                <Image src={client2} className="img-fluid" alt="" />
              </div>
            </Col>
            <Col lg={2}>
              <div className="client-box mt-4 text-center">
                <Image src={client3} className="img-fluid" alt="" />
              </div>
            </Col>
            <Col lg={2}>
              <div className="client-box mt-4 text-center">
                <Image src={client4} className="img-fluid" alt="" />
              </div>
            </Col>
            <Col lg={2}>
              <div className="client-box mt-4 text-center">
                <Image src={client5} className="img-fluid" alt="" />
              </div>
            </Col>
            <Col lg={2}>
              <div className="client-box mt-4 text-center">
                <Image src={client6} className="img-fluid" alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Clients
