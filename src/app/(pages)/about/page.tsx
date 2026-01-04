import Header from '@/components/layout/topnav/Header'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Pricing from './components/Pricing'
import Service from './components/Service'
import Team from './components/Team'

const Page = () => {
  return (
    <>
      <Header />
      <Hero />
      <Service />
      <Team />
      <Pricing />
      <Footer />
    </>
  )
}

export default Page
