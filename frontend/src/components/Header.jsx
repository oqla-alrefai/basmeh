import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isOpen} />
    </div>
  )
}

export default Header