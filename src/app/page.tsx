import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/topnav/Header'
import Attractions from '@/app/home/light/components/Attractions'
import Restaurants from '@/app/home/light/components/Restaurants'
import SecretTrails from '@/app/home/light/components/SecretTrails'
import ReviewsCarousel from '@/app/home/light/components/ReviewsCarousel'
import Contact from '@/app/home/light/components/Contact'
import Features from '@/app/home/light/components/Features'
import FloatingAvailability from '@/app/home/light/components/FloatingAvailability'
import Hero from '@/app/home/light/components/Hero'
import Portfolio from '@/app/home/light/components/Portfolio'
import WhatsAppButton from '@/app/home/light/components/WhatsAppButton'
import WazeButton from '@/app/home/light/components/WazeButton'

const Page = () => {
  return (
    <>
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
      <Attractions />
      <Restaurants />
      <SecretTrails />
      <ReviewsCarousel />
      <Contact />
      <Footer />
      <FloatingAvailability />
      <WazeButton />
      <WhatsAppButton />
    </>
  )
}

export default Page

