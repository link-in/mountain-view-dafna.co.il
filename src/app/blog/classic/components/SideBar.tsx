import blog1 from '@/assets/images/blog/img-1.jpg'
import blog2 from '@/assets/images/blog/img-2.jpg'
import blog3 from '@/assets/images/blog/img-3.jpg'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import { Col } from 'react-bootstrap'
import about from '@/assets/images/about-img.png'

const SideBar = () => {
  return (
    <>
      <Col lg={4}>
        <div className="left-bar">
          <div className="border rounded">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">Search</h6>
              </div>
              <div className="search-form mt-4">
                <form action="">
                  <div className="form-group mb-0">
                    <input placeholder="Search Keywords" type="text" />
                    <Icon icon="mdi:magnify" className="mdi f-20" />
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="border rounded mt-5">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">About</h6>
              </div>
              <div className="text-center mt-4">
                <Image src={about} className="img-fluid w-50 rounded-circle" alt="" />
                <p className="mt-4">Hye, I’m Ricky Walker residing in this beautiful world. apps with great UX and UI design. </p>
                <div className="mt-4">
                  <Link href="" className="text-dark font-weight-500">
                    Read More <Icon icon="mdi:arrow-end" className="mdi" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded mt-5">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">Social Links</h6>
              </div>
              <ul className="list-inline links-social mb-0 mt-4 text-center">
                <li className="list-inline-item">
                  <Link href="" className="rounded-circle">
                    <Icon icon="mdi:facebook" className="mdi" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link href="" className="rounded-circle">
                    <Icon icon="mdi:twitter" className="mdi" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link href="" className="rounded-circle">
                    <Icon icon="mdi:linkedin" className="mdi" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link href="" className="rounded-circle">
                    <Icon icon="mdi:vimeo" className="mdi" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border rounded mt-5">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">Categories</h6>
              </div>
              <ul className="list-unstyled mb-0 mt-4">
                <li className="border-bottom pb-3">
                  <Link href="" className="text-dark">
                    Journey
                  </Link>
                  <span className="f-12 float-end">(40)</span>
                </li>
                <li className="border-bottom pb-3 pt-3">
                  <Link href="" className="text-dark">
                    Photography
                  </Link>
                  <span className="f-12 float-end">(11)</span>
                </li>
                <li className="border-bottom pb-3 pt-3">
                  <Link href="" className="text-dark">
                    Lifestyle
                  </Link>
                  <span className="f-12 float-end">(09)</span>
                </li>
                <li className="pt-3">
                  <Link href="" className="text-dark">
                    Food &amp; Drinks
                  </Link>
                  <span className="f-12 float-end">(28)</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border rounded mt-5">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">Popular Posts</h6>
              </div>
              <ul className="list-unstyled mb-0 mt-4">
                <li className="clearfix mb-3 pb-3">
                  <div className="popular-post float-start">
                    <Link href="">
                      <Image src={blog1} alt="" className="img-fluid rounded" />
                    </Link>
                  </div>
                  <h6 className="ml-5 ps-5">
                    <Link href="" className="text-dark">
                      Beautiful With Friends.
                    </Link>
                  </h6>
                  <p className="ml-5 ps-5 mb-0 text-muted">April 15 2019</p>
                </li>
                <li className="clearfix mb-3 pb-3">
                  <div className="popular-post float-start">
                    <Link href="">
                      <Image src={blog2} alt="" className="img-fluid rounded" />
                    </Link>
                  </div>
                  <h6 className="ml-5 ps-5">
                    <Link href="" className="text-dark">
                      Nature vaey cooling.
                    </Link>
                  </h6>
                  <p className="ml-5 ps-5 mb-0 text-muted">April 10 2019</p>
                </li>
                <li className="clearfix">
                  <div className="popular-post float-start">
                    <Link href="">
                      <Image src={blog3} alt="" className="img-fluid rounded" />
                    </Link>
                  </div>
                  <h6 className="ml-5 ps-5">
                    <Link href="" className="text-dark">
                      15 Best Healthy Salad.
                    </Link>
                  </h6>
                  <p className="ml-5 ps-5 mb-0 text-muted">April 8 2019</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="border rounded mt-5">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">Tags</h6>
              </div>
              <div className="tags mt-4">
                <Link href="" className="f-12">
                  Advertisement
                </Link>
                <Link href="" className="f-12">
                  Blog
                </Link>
                <Link href="" className="f-12">
                  Fashion
                </Link>
                <Link href="" className="f-12">
                  Inspiration
                </Link>
                <Link href="" className="f-12">
                  Smart Quotes
                </Link>
                <Link href="" className="f-12">
                  Conceptual
                </Link>
                <Link href="" className="f-12">
                  Artistry
                </Link>
                <Link href="" className="f-12">
                  Unique
                </Link>
              </div>
            </div>
          </div>
          <div className="border rounded mt-5">
            <div className="p-4">
              <div className="bg-dark p-2 rounded">
                <h6 className="text-white text-center mt-1 mb-1 mb-0 text-uppercase">Subscribe</h6>
              </div>
              <p className="text-muted mt-4">Get the latest news, discounts, offers.</p>
              <div className="search-form">
                <form action="">
                  <input placeholder="Enter Email Address" type="text" />
                  <i className="mdi mdi-email f-20" />
                  <button type="submit" className="btn btn-dark-custom w-100 mt-3">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  )
}

export default SideBar
