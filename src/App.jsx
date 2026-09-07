import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Skills from './components/Skills'
import AboutPreview from './components/AboutPreview'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Mid from './components/mid'
import GrainOverlay from './components/GrainOverlay'
import ScrollTint from './components/ScrollTint'
import CustomCursor from './components/CustomCursor'

const App = () => {
  return (
    <div>
      <CustomCursor />
      <GrainOverlay />
      <Navbar />
      <Home />
      <ScrollTint>
      <Mid />
      <Skills />
      <Projects />
      <AboutPreview />
      </ScrollTint>
      <Contact />
    </div>
  )
}

export default App