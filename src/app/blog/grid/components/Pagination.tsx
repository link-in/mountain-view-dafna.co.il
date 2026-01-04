import { Icon } from '@iconify/react'
import Link from 'next/link'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const Pagination = () => {
  return (
    <>
      <section className="section pt-0">
        <Container>
          <Row>
            <Col lg={12}>
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
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Pagination
