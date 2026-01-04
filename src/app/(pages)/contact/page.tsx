import Header from '@/components/layout/topnav/Header'
import { Col, Container, Row } from 'react-bootstrap'
import Footer from './components/Footer'
import Form from './components/Form'
import Map from './components/Map'

const Page = () => {
  return (
    <>
      <Header />
      <section className="bg-title bg-light" id="home">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center">
                <h2 className="text-uppercase ls-4">Contact Us</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Form />
      <Map />
      <Footer />
    </>
  )
}

export default Page
