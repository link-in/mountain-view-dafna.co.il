import D3 from '@/assets/images/icons/3d.png'
import dartstarget from '@/assets/images/icons/dartstarget.png'
import growing from '@/assets/images/icons/growing.png'
import moderncam from '@/assets/images/icons/moderncam.png'
import spaceship from '@/assets/images/icons/spaceship.png'
import tamburine from '@/assets/images/icons/tamburine.png'
import Image, { StaticImageData } from 'next/image'
import { Col, Container, Row } from 'react-bootstrap'

type ServiceItem = {
  title: string
  description: string
  image: StaticImageData
}

const services: ServiceItem[] = [
  {
    title: 'Web Design',
    description: 'Donec lacus rutrum eget diam iacris vehicula darui Sed auctor urna enim ullcorper malesuada.',
    image: D3,
  },
  {
    title: 'Development',
    description: 'Donec lacus rutrum eget diam iacris vehicula darui Sed auctor urna enim ullcorper malesuada.',
    image: growing,
  },
  {
    title: 'Photography',
    description: 'Donec lacus rutrum eget diam iacris vehicula darui Sed auctor urna enim ullcorper malesuada.',
    image: moderncam,
  },
  {
    title: 'Branding',
    description: 'Donec lacus rutrum eget diam iacris vehicula darui Sed auctor urna enim ullcorper malesuada.',
    image: tamburine,
  },
  {
    title: 'Marketing',
    description: 'Donec lacus rutrum eget diam iacris vehicula darui Sed auctor urna enim ullcorper malesuada.',
    image: dartstarget,
  },
  {
    title: 'Support',
    description: 'Donec lacus rutrum eget diam iacris vehicula darui Sed auctor urna enim ullcorper malesuada.',
    image: spaceship,
  },
]

const Service = () => {
  return (
    <>
      <section className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center">
                <h2>
                  <span className="font-weight-300">Our</span> Services
                </h2>
                <p className="text-muted mt-3">
                  Pharetra ipsum dignissim fermentum donec dolor tellus sodales pretium eget velit
                  <br /> maecenas egestas massa sollicitudin rhoncus.
                </p>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            {services.slice(0, 3).map((item, idx) => (
              <Col lg={4} key={idx}>
                <div className="services-box rounded mt-4 border">
                  <div className="services-img">
                    <Image src={item.image} width={50} height={50} className="img-fluid" alt="" />
                  </div>
                  <h5 className="text-uppercase f-18 mt-4 pt-2">{item.title}</h5>
                  <p className="text-muted mt-4 mb-0">{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
          <Row className="mt-2">
            {services.slice(3, 6).map((item, idx) => (
              <Col lg={4} key={idx}>
                <div className="services-box rounded mt-4 border">
                  <div className="services-img">
                    <Image src={item.image} width={50} height={50} className="img-fluid" alt="" />
                  </div>
                  <h5 className="text-uppercase f-18 mt-4 pt-2">{item.title}</h5>
                  <p className="text-muted mt-4 mb-0">{item.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Service
