import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/topnav/Header'
import Attractions from '@/components/home/Attractions'
import Restaurants from '@/components/home/Restaurants'
import SecretTrails from '@/components/home/SecretTrails'
import ReviewsCarousel from '@/components/home/ReviewsCarousel'
import Contact from '@/components/home/Contact'
import Features from '@/components/home/Features'
import FloatingAvailability from '@/components/home/FloatingAvailability'
import Hero from '@/components/home/Hero'
import Portfolio from '@/components/home/Portfolio'
import WhatsAppButton from '@/components/home/WhatsAppButton'
import WazeButton from '@/components/home/WazeButton'
import HotelStructuredDataServer from '@/components/home/HotelStructuredDataServer'

const Page = () => {
  return (
    <>
      <HotelStructuredDataServer />
      <div className="header-mobile-only">
        <Header />
      </div>
      <div 
        className="main-tilte text-center" 
        style={{
          position: 'absolute',
          top: '20px',
          left: 0,
          width: '100%',
          zIndex: 1000,
          padding: '8px 0',
          transition: 'background 0.3s ease',
        }}>
      
        <h1 className="main-title" style={{ fontSize: '38px' , fontWeight: 'bold', color: '#0d9488',margin: '0', textShadow: '0px 0px 1px #ffffff', fontFamily: 'Rubik, sans-serif' }}> 
          <span className="font-weight-300">נוף הרים</span> בדפנה
        </h1>
        <h2 className="main-subtitle" style={{margin: '0',fontSize: '12px',textShadow: '0px 0px 3px      #000', fontFamily: 'Rubik, sans-serif' }}>בין פלגי הדן אל מול נופי חרמון</h2>
      </div>
      <Hero />
      <Features />
      <Portfolio />
      <ReviewsCarousel />
      <Attractions />
      <Restaurants />
      <SecretTrails />
      <Contact />
      <Footer />
      <FloatingAvailability />
      <WazeButton />
      <WhatsAppButton />
    </>
  )
}

export default Page

