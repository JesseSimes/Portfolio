import React from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Mid from './components/mid'

const App = () => {
  return (
    <div className="bg-orange-100">
      <Navbar />
      <Home />
      <Mid />
      <About />
      <Projects />
      <Contact />
    </div>
  )
}

export default App