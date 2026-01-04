import shop1 from '@/assets/images/shop/img-1.png'
import shop2 from '@/assets/images/shop/img-2.png'
import shop3 from '@/assets/images/shop/img-3.png'
import shop4 from '@/assets/images/shop/img-4.png'
import shop5 from '@/assets/images/shop/img-5.png'
import shop6 from '@/assets/images/shop/img-6.png'
import { Icon } from '@iconify/react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

type ProductType = {
  title: string
  price: string
  image: StaticImageData
  rating: number
}

const products: ProductType[] = [
  { title: 'Denim Jacket', price: '$18.00', image: shop1, rating: 3.5 },
  { title: 'Black Purse', price: '$9.00', image: shop2, rating: 4 },
  { title: 'Black Jacket', price: '$29.00', image: shop3, rating: 5 },
  { title: 'Black T-Shirt', price: '$6.00', image: shop4, rating: 2.5 },
  { title: 'DSLR Camera', price: '$228.00', image: shop5, rating: 4 },
  { title: 'Checked Shirt', price: '$22.00', image: shop6, rating: 3.5 },
]

const Layout = () => {
  return (
    <>
      <section className="section pb-0">
        <Container>
          <Row className="align-items-center">
            <Col lg={9}>
              <h2>Shop</h2>
              <p className="text-muted">Showing 1–6 of 8 results</p>
            </Col>
            <Col lg={3}>
              <div className="form custom-form">
                <div className="form-group">
                  <select className="form-control" id="exampleFormControlSelect1">
                    <option>Sort by average rating</option>
                    <option>Sort by newness</option>
                    <option>Sort by price: low to high</option>
                    <option>Sort by price: high to low</option>
                  </select>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            {products.slice(0, 3).map((item, idx) => (
              <Col lg={4} key={idx}>
                <div className="shop-box border p-3 mt-4">
                  <Link href="">
                    <Image src={item.image} className="img-fluid" alt="" />
                  </Link>
                  <div className="mt-4">
                    <div className="float-right mt-3">
                      <Icon icon="mdi:star" className="mdi" />
                      <Icon icon="mdi:star" className="mdi" />
                      <Icon icon="mdi:star" className="mdi" />
                      <Icon icon="mdi:star" className="mdi" />
                    </div>
                    <Link href="">
                      <h6 className="text-dark">{item.title}</h6>
                      <p className="text-dark">{item.price}</p>
                    </Link>
                  </div>
                  <div className="mt-4">
                    <Link href="" className="btn btn-md btn-dark-custom">
                      <Icon icon="mdi:cart" className="mdi" /> Add to cart
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Row className="mt-2">
            {products.slice(3, 6).map((item, idx) => (
              <Col lg={4} key={idx}>
                <div className="shop-box border p-3 mt-4">
                  <Link href="">
                    <Image src={item.image} className="img-fluid" alt="" />
                  </Link>
                  <div className="mt-4">
                    <div className="float-right mt-3">
                      <Icon icon="mdi:star" className="mdi" />
                      <Icon icon="mdi:star" className="mdi" />
                      <Icon icon="mdi:star" className="mdi" />
                      <Icon icon="mdi:star" className="mdi" />
                    </div>
                    <Link href="">
                      <h6 className="text-dark">{item.title}</h6>
                      <p className="text-dark">{item.price}</p>
                    </Link>
                  </div>
                  <div className="mt-4">
                    <Link href="" className="btn btn-md btn-dark-custom">
                      <Icon icon="mdi:cart" className="mdi" /> Add to cart
                    </Link>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          <Row className="mt-5">
            <Col lg={12}>
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
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Layout
