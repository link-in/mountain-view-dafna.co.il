import img1 from '@/assets/images/blog/img-1.jpg'
import img2 from '@/assets/images/blog/img-2.jpg'
import img3 from '@/assets/images/blog/img-3.jpg'
import img4 from '@/assets/images/blog/img-4.jpg'
import img5 from '@/assets/images/blog/img-5.jpg'
import img6 from '@/assets/images/blog/img-6.jpg'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

type BlogPost = {
  category: string
  title: string
  description: string
  image: StaticImageData
}

const blogPosts: BlogPost[] = [
  {
    category: 'UI & UX Design',
    title: 'Vestibulum posuere Nulla ardnd lobortis magna.',
    description: 'Placerat metus laoreet Maecenas gravida erat eu ultrices luctus mi efficitur metus porta Integer venenatis elit.',
    image: img1,
  },
  {
    category: 'Digital Marketing',
    title: 'Egestas massa on elit commodo sapien sheets erat.',
    description: 'Vestibulum sollicitudin lorem at tristique pretium augue diam tortor consectetur risus mauris vel consectetur.',
    image: img2,
  },
  {
    category: 'Travelling',
    title: 'Consequat niasal dapibus purus volutpat evolved sagitis.',
    description: 'Plarat tortor nunc digsim tempus quisque pellesque mattis magna viverra porta ligula risus ante gravida quis.',
    image: img3,
  },
  {
    category: 'UI & UX Design',
    title: 'Vestibulum posuere Nulla ardnd lobortis magna.',
    description: 'Placerat metus laoreet Maecenas gravida erat eu ultrices luctus mi efficitur metus porta Integer venenatis elit.',
    image: img4,
  },
  {
    category: 'Digital Marketing',
    title: 'Egestas massa on elit commodo sapien sheets erat.',
    description: 'Vestibulum sollicitudin lorem at tristique pretium augue diam tortor consectetur risus mauris vel consectetur.',
    image: img5,
  },
  {
    category: 'Travelling',
    title: 'Consequat niasal dapibus purus volutpat evolved sagitis.',
    description: 'Plarat tortor nunc digsim tempus quisque pellesque mattis magna viverra porta ligula risus ante gravida quis.',
    image: img6,
  },
]

const Blog = () => {
  return (
    <>
      <section className="section">
        <Container>
          <Row>
            {blogPosts.slice(0, 3).map((item, idx) => (
              <Col lg={4} key={idx}>
                <div className="blog-box">
                  <div className="blog-img">
                    <Image src={item.image} className="img-fluid rounded" alt="" />
                  </div>
                  <div className="blog-info mt-2 p-2">
                    <p className="text-muted font-weight-500 mb-0">{item.category}</p>
                    <h5 className="line-height_1_6 f-18 mt-3">
                      <Link href="" className="text-dark">
                        {item.title}
                      </Link>
                    </h5>
                    <p className="text-muted mt-3">{item.description}</p>
                    <div className="mt-4">
                      <Link href="" className="btn btn-md btn-dark-custom">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Row className="mt-5">
            {blogPosts.slice(3, 6).map((item, idx) => (
              <Col lg={4} key={idx}>
                <div className="blog-box">
                  <div className="blog-img">
                    <Image src={item.image} className="img-fluid rounded" alt="" />
                  </div>
                  <div className="blog-info mt-2 p-2">
                    <p className="text-muted font-weight-500 mb-0">{item.category}</p>
                    <h5 className="line-height_1_6 f-18 mt-3">
                      <Link href="" className="text-dark">
                        {item.title}
                      </Link>
                    </h5>
                    <p className="text-muted mt-3">{item.description}</p>
                    <div className="mt-4">
                      <Link href="" className="btn btn-md btn-dark-custom">
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Blog
