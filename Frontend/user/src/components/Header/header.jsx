import React from 'react'
import styles from './header.module.css'
import logo from '../../assets/GeeZee.png'
function header() {
  return (

    <header  className={` h-20 bg-charcoal`}>
        <img src={logo} className='h-20'></img>
        
    </header>
  )
}

export default header
