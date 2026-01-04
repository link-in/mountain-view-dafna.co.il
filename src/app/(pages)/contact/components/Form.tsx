import earth from '@/assets/images/icons/earth.png'
import mobilepay from '@/assets/images/icons/mobilepay.png'
import spaceship from '@/assets/images/icons/spaceship.png'
import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'

const Form = () => {
  return (
    <>
      <section className="section">
        <Container>
          <Row className="justify-content-start">
            <Col lg={8}>
              <h2>Let's keep in touch.</h2>
              <p className="text-muted mt-3">
                Aenean sollicitudin quis bibendum auctor nisi elit consequat nec sagittis sem nibh id elit Proin gravida nibh vel velit auctor Aenean
                sollicitudin adipisicing elit sed lorem quis bibendum auctor.
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <div className="custom-form mt-5">
                <div id="message" />
                <form method="post" name="contact-form" id="contact-form">
                  <Row>
                    <Col lg={6}>
                      <div className="form-group">
                        <input name="name" id="name" type="text" className="form-control" placeholder="Your Name" />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <input name="email" id="email" type="email" className="form-control" placeholder="Email" />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6}>
                      <div className="form-group">
                        <input type="text" className="form-control" id="subject" placeholder="Subject" />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group">
                        <input type="password" className="form-control" id="password" placeholder="Password" />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12}>
                      <div className="form-group">
                        <textarea name="comments" id="comments" rows={4} className="form-control" placeholder="Your Message" />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={12}>
                      <input type="submit" id="submit" name="send" className="submitBnt btn btn-dark-custom btn-round" defaultValue="Send Message" />
                      <div id="simple-msg" />
                    </Col>
                  </Row>
                </form>
              </div>
            </Col>
            <Col lg={4}>
              <div className="mt-5">
                <div>
                  <div className="contact-img float-start me-3">
                    <Image width={35} height={35} src={spaceship} alt="" />
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="mt-2">Office Address</h6>
                    <p className="text-muted mb-0">4514 West Street Helena</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="contact-img float-start me-3">
                    <Image width={35} height={35} src={mobilepay} alt="" />
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="mt-2">Phone Number</h6>
                    <p className="text-muted mb-0">+001 406-471-0400</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="contact-img float-start me-3">
                    <Image width={35} height={35} src={earth} alt="" />
                  </div>
                  <div className="overflow-hidden">
                    <h6 className="mt-2">Office Website</h6>
                    <p className="text-muted mb-0">Candiarity@joapide.com</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Form
