import React from 'react'

import { Navigate } from 'react-router-dom'
function protectedRoute({children}) {
 const id=localStorage.getItem('id')

  return (
    id? children:<Navigate to='/' /> 
  )
}

export default protectedRoute

