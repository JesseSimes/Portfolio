import React from 'react'

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-2 bg-gray-800 text-white">
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