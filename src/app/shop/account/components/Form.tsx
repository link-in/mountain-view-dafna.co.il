import Link from 'next/link'
import { Col, Container, Row } from 'react-bootstrap'

const Form = () => {
  return (
    <>
      <section className="section pb-0">
        <Container>
          <Row>
            <Col lg={6}>
              <h4 className="mt-4">Login</h4>
              <form className="custom-form mt-5">
                <Row>
                  <Col lg={12}>
                    <div className="form-group">
                      <label>Username or Email address</label>
                      <input name="name" id="username" type="text" className="form-control" placeholder="Username" />
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12}>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" className="form-control" id="password1" placeholder="Password" />
                    </div>
                  </Col>
                </Row>
                <div className="custom-control custom-checkbox mt-2">
                  <input type="checkbox" className="custom-control-input" id="customCheck1" />
                  &nbsp;
                  <label className="custom-control-label" htmlFor="customCheck1">
                    Remember me
                  </label>
                </div>
                <div className="mt-4 pe-4">
                  <button className="btn btn-dark-custom">Sign in</button>
                </div>
              </form>
            </Col>
            <Col lg={6}>
              <h4 className="mt-4">Register</h4>
              <form className="custom-form mt-5">
                <Row>
                  <Col lg={12}>
                    <div className="form-group">
                      <label>Email address</label>
                      <input name="name" id="name" type="text" className="form-control" placeholder="Email Address" />
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12}>
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" className="form-control" id="password2" placeholder="Password" />
                    </div>
                  </Col>
                </Row>
                <div className="custom-control custom-checkbox mt-2">
                  <input type="checkbox" className="custom-control-input" id="customCheck2" />
                  &nbsp;
                  <label className="custom-control-label" htmlFor="customCheck2">
                    I Accept <Link href="">Terms And Condition</Link>
                  </label>
                </div>
                <div className="mt-4 pe-4">
                  <button className="btn btn-dark-custom">Register</button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Form
