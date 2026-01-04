import post1 from '@/assets/images/blog-post/img-1.jpg'
import post2 from '@/assets/images/blog-post/img-2.jpg'
import post3 from '@/assets/images/blog-post/img-3.jpg'
import post4 from '@/assets/images/blog-post/img-4.jpg'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

const Detail = () => {
  return (
    <>
      <section className="section">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="blog-post">
                <div className="blog-box">
                  <div className="blog-img">
                    <Image src={post1} className="img-fluid rounded" alt="" />
                  </div>
                  <div className="blog-info mt-4 p-2">
                    <h4>
                      <Link href="" className="text-dark">
                        Vestibulum posuere Nulla lobortis magna.
                      </Link>
                    </h4>
                    <p className="text-muted mt-3 f-15 mb-0">
                      September 24, 2019 -By
                      <Link href="" className="text-dark font-weight-500">
                        John Handley
                      </Link>
                      - 12
                      <Link href="" className="text-dark font-weight-500">
                        Comments
                      </Link>
                    </p>
                    <hr className="mt-4" />
                    <p className="text-muted mt-4">
                      Placerat metus laoreet at Maecenas gravida erat eu ultrices luctus mi leo efficitur metus ac condimentum elit tortor ut orci
                      Nulla pharetra arcu non tristique hendrerit maecenas tincidunt convallis metus sit amet porta Integer venenatis elit.
                    </p>
                    <div className="mt-4">
                      <Link href="" className="btn btn-dark-custom">
                        Read more <Icon icon="mdi:arrow-right" className="mdi" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="blog-box mt-5">
                  <div className="blog-img">
                    <Image src={post2} className="img-fluid rounded" alt="" />
                  </div>
                  <div className="blog-info mt-4 p-2">
                    <h4>
                      <Link href="" className="text-dark">
                        Egestas massa elit commodo sapien erat.
                      </Link>
                    </h4>
                    <p className="text-muted mt-3 f-15 mb-0">
                      September 25, 2019 -By
                      <Link href="" className="text-dark font-weight-500">
                        John Handley
                      </Link>
                      - 2
                      <Link href="" className="text-dark font-weight-500">
                        Comments
                      </Link>
                    </p>
                    <hr className="mt-4" />
                    <p className="text-muted mt-4">
                      Vestibulum sollicitudin lorem at tristique pretium augue diam facilisis tortor consectetur risus mauris vel nunc Vestibulum
                      commodo condimentum odio et fringilla Aenean nunc odio suscipit nec odio et consectetur semper lacus.
                    </p>
                    <div className="mt-4">
                      <Link href="" className="btn btn-dark-custom">
                        Read more <Icon icon="mdi:arrow-right" className="mdi" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="blog-box mt-5">
                  <div className="blog-img">
                    <Image src={post3} className="img-fluid rounded" alt="" />
                  </div>
                  <div className="blog-info mt-4 p-2">
                    <h4>
                      <Link href="" className="text-dark">
                        Consequat nisl dapibus volutpat purus sagitis.
                      </Link>
                    </h4>
                    <p className="text-muted mt-3 f-15 mb-0">
                      September 26, 2019 -By
                      <Link href="" className="text-dark font-weight-500">
                        John Handley
                      </Link>
                      - 8
                      <Link href="" className="text-dark font-weight-500">
                        Comments
                      </Link>
                    </p>
                    <hr className="mt-4" />
                    <p className="text-muted mt-4">
                      Placerat nec tortor nunc dignissim tempus quisque pellentesque mattis magna viverra porta ligula risus venenatis vel consequat
                      elit vulputate sed condimentum justo purus lobortis ante laoreet mattis mi gravida quis.
                    </p>
                    <div className="mt-4">
                      <Link href="" className="btn btn-dark-custom">
                        Read more <Icon icon="mdi:arrow-right" className="mdi" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="blog-box mt-5">
                  <div className="blog-img">
                    <Image src={post4} className="img-fluid rounded" alt="" />
                  </div>
                  <div className="blog-info mt-4 p-2">
                    <h4>
                      <Link href="" className="text-dark">
                        Faucibus lectus commodo est ultrices ultrices.
                      </Link>
                    </h4>
                    <p className="text-muted mt-3 f-15 mb-0">
                      September 27, 2019 -By
                      <Link href="" className="text-dark font-weight-500">
                        John Handley
                      </Link>
                      - 10
                      <Link href="" className="text-dark font-weight-500">
                        Comments
                      </Link>
                    </p>
                    <hr className="mt-4" />
                    <p className="text-muted mt-4">
                      Vestibulum nulla lectus iaculis non iaculis pulvinar purus donec in libero mollis luctus nisl nec mollis tortor Nunc tempus leo
                      interdum congue, lacus urna iaculis tellus a porta nisi urna eget nulla nullam fringilla eleifend elit quis porttitor.
                    </p>
                    <div className="mt-4">
                      <Link href="" className="btn btn-dark-custom">
                        Read more <Icon icon="mdi:arrow-right" className="mdi" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={12}>
              <div className="mt-5">
                <div className="mt-5">
                  <ul className="pagination mt-3">
                    <li className="next">
                      <Link href="">
                        <Icon icon="mdi:chevron-left" className="mdi" />
                      </Link>
                    </li>
                    <li className="active">
                      <Link href="">1</Link>
                    </li>
                    <li>
                      <Link href="">2</Link>
                    </li>
                    <li>
                      <Link href="">3</Link>
                    </li>
                    <li>
                      <Link href="">4</Link>
                    </li>
                    <li>
                      <Link href="">5</Link>
                    </li>
                    <li className="prev">
                      <Link href="">
                        <Icon icon="mdi:chevron-right" className="mdi" />
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

export default Detail
