import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/topnav/Header'
import { Col, Container, Row } from 'react-bootstrap'
import Contact from './components/Contact'
import Portfolio from './components/Portfolio'

const Page = () => {
  return (
    <>
      <Header />
      <section className="bg-title bg-light" id="home">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center">
                <h2 className="text-uppercase ls-4">portfolio Masonry</h2>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Portfolio />
      <Contact />
      <Footer />
    </>
  )
}

export default Page
