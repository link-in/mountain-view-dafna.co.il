import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/topnav/Header'
import Contact from './components/Contact'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'

const Page = () => {
  return (
    <>
      <Header />
      <Hero />
      <Portfolio />
      <Contact />
      <Footer />
    </>
  )
}

export default Page
