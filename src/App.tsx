import AboutSection from './components/sections/AboutSection'
import HeroSection from './components/sections/HeroSection'
import MarqueeSection from './components/sections/MarqueeSection'
import ProjectsSection from './components/sections/ProjectsSection'
import ServicesSection from './components/sections/ServicesSection'
import SiteNav from './components/ui/SiteNav'
import ContactFooter from './components/sections/ContactFooter'

export default function App() {
  return (
    <div className="overflow-x-clip bg-dark font-kanit">
      <SiteNav />
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <div className="relative z-10 bg-dark">
        <ContactFooter />
      </div>
    </div>
  )
}
