import { Icon } from '@iconify/react'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

const Hero = () => {
  return (
    <>
      <section className="bg-image" id="home">
        <div className="bg-overlay" />
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="text-center text-white">
                <h1 className="text-uppercase display-4 font-weigh-bold ls-4">Hello, I am Joognu.</h1>
                <p className="mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaec non anim
                  id est laborum.
                </p>
                <div className="border-bottom w-25 mx-auto mt-4 pt-2" />
                <div className="mt-4 pt-2">
                  <ul className="list-inline home-social">
                    <li className="list-inline-item">
                      <Link href="">
                        <Icon icon="mdi:facebook" className="mdi" />
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="">
                        <Icon icon="mdi:twitter" className="mdi" />
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="">
                        <Icon icon="mdi:dribble" className="mdi" />
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="">
                        <Icon icon="mdi:instagram" className="mdi" />
                      </Link>
                    </li>
                    <li className="list-inline-item">
                      <Link href="">
                        <Icon icon="mdi:google-plus" className="mdi" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Hero
