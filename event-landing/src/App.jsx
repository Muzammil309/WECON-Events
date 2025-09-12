import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Agenda from '../components/Agenda'
import Speakers from '../components/Speakers'
import Tickets from '../components/Tickets'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import './index.css'

function App() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <About />
        <Agenda />
        <Speakers />
        <Tickets />
        <Gallery />
        <Contact />
      </motion.main>
      
      <Footer />
    </div>
  )
}

export default App
