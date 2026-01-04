import team1 from '@/assets/images/team/img-1.jpg'
import team2 from '@/assets/images/team/img-2.jpg'
import team3 from '@/assets/images/team/img-3.jpg'
import Image from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'

const Team = () => {
  return (
    <>
      <section className="section bg-light">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <h2>
                  <span className="font-weight-300">Our</span> Team
                </h2>
                <p className="text-muted mt-3">
                  Pharetra ipsum dignissim fermentum donec dolor tellus sodales pretium eget velit
                  <br /> maecenas egestas massa sollicitudin rhoncus.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={4}>
              <div className="team-box mt-4 p-4">
                <Image src={team1} className="img-fluid rounded" alt="" />
                <h5 className="text-uppercase mb-0 f-18 mt-3">Nelson Charley</h5>
                <p className="text-muted mt-2 mb-0">Web Designer</p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="team-box mt-4 p-4">
                <Image src={team2} className="img-fluid rounded" alt="" />
                <h5 className="text-uppercase f-18 mb-0 mt-3">Maurice Slover</h5>
                <p className="text-muted mt-2 mb-0">Web Developer</p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="team-box mt-4 p-4">
                <Image src={team3} className="img-fluid rounded" alt="" />
                <h5 className="text-uppercase f-18 mb-0 mt-3">Ronald Saucier</h5>
                <p className="text-muted mt-2 mb-0">Ceo, Foundar</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Team
