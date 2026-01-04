import { Col, Container, Row } from 'react-bootstrap'

const Hero = () => {
  return (
    <>
      <section className="bg-title bg-light" id="home">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center">
                <h2 className="text-uppercase ls-4">My Account</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Hero
