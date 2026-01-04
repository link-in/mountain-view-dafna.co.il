import port10 from '@/assets/images/portfolio/img-10.png'
import port11 from '@/assets/images/portfolio/img-11.png'
import port12 from '@/assets/images/portfolio/img-12.png'
import port13 from '@/assets/images/portfolio/img-13.png'
import port14 from '@/assets/images/portfolio/img-14.png'
import port9 from '@/assets/images/portfolio/img-9.png'
import Image from 'next/image'
import Link from 'next/link'

const Instagram = () => {
  return (
    <>
      <section className="section">
        <ul className="instagram mb-0">
          <li>
            <Link href="">
              <Image src={port9} alt="" className="img-fluid" />
            </Link>
          </li>
          <li>
            <Link href="">
              <Image src={port10} alt="" className="img-fluid" />
            </Link>
          </li>
          <li>
            <Link href="">
              <Image src={port11} alt="" className="img-fluid" />
            </Link>
          </li>
          <li>
            <Link href="">
              <Image src={port12} alt="" className="img-fluid" />
            </Link>
          </li>
          <li>
            <Link href="">
              <Image src={port13} alt="" className="img-fluid" />
            </Link>
          </li>
          <li>
            <Link href="">
              <Image src={port14} alt="" className="img-fluid" />
            </Link>
          </li>
        </ul>
        <div className="instagram-lable text-center">
          <Link href="">
            <p className="text-white bg-dark rounded p-3 mb-0">Follow In Instagram</p>
          </Link>
        </div>
      </section>
    </>
  )
}

export default Instagram
