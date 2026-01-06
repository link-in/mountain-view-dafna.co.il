import Footer from '@/components/layout/footer/Footer'
import Header from '@/components/layout/topnav/Header'
import Attractions from './components/Attractions'
import Restaurants from './components/Restaurants'
import Contact from './components/Contact'
import Features from './components/Features'
import FloatingAvailability from './components/FloatingAvailability'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import WhatsAppButton from './components/WhatsAppButton'
import WazeButton from './components/WazeButton'

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
      
        <h1 className="main-title" style={{ fontSize: '38px' , fontWeight: 'bold', color: '#ffffff',margin: '0', textShadow: '0px 0px 3px #000' }}> 
          <span className="font-weight-300">נוף הרים</span> בדפנה
        </h1>
        <h2 className="main-subtitle" style={{margin: '0',fontSize: '12px',textShadow: '0px 0px 3px      #000' }}>בין פלגי הדן אל מול נופי חרמון</h2>
      </div>
      <Hero />
      <Features />
      <Portfolio />
      <Attractions />
      <Restaurants />
      <Contact />
      <Footer />
      <FloatingAvailability />
      <WazeButton />
      <WhatsAppButton />
    </>
  )
}

export default Page
