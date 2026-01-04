import { Col, Container, Row } from 'react-bootstrap'

const Map = () => {
  return (
    <>
      <section className="section pt-0">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d59512.84871837034!2d72.81541119999999!3d21.2099072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1559885311482!5m2!1sen!2sin"
                  style={{ border: 0 }}
                  allowFullScreen
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Map
