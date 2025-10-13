import React from 'react'
import Header from '../../pages/HeaderPage/Header'
import Footer from '../../pages/FooterPage/Footer'

function Default({children}) {
  return (
    <div>
        <Header/>
        {children}
        <Footer/>
    </div>
  )
}

export default Default