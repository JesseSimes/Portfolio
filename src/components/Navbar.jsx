import React from 'react'

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between bg-gray-800 p-2 text-white">
      <div>LOGO</div>
      <div className="flex space-x-3">
        <div>ABOUT</div>
        <div>PROJECTS</div>
        <div>CONTACT</div>
      </div>
    </div>
  )
}

export default Navbar