import { Col, Container, Row } from 'react-bootstrap'
import Clients from './components/Clients'
import Footer from './components/Footer'
import Service from './components/Service'
import Header from '@/components/layout/topnav/Header'

const Page = () => {
  return (
    <>
      <Header />
      <section className="bg-title bg-light" id="home">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center">
                <h2 className="text-uppercase ls-4">Our Service</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Service />
      <Clients />
      <Footer />
    </>
  )
}

export default Page
