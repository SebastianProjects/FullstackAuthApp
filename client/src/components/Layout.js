import React from 'react'
import { Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
      <main className='App'>
        <Outlet />
      </main>
  )
}

export default Layout
