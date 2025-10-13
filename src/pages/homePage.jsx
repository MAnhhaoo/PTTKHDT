import React from 'react'
import IndexComponent from '../components/IndexComponent/IndexComponent'
import Story from '../components/StroryComponent/Story'
import Menu from '../components/MenuComponent/Menu'
import Guide from '../components/GuideComponent/Guide'

const homePage = () => {
  return (
    <div>
      <IndexComponent/>
      <Story/>
      <Menu/>
      <Guide/>
      
    </div>
  )
}

export default homePage