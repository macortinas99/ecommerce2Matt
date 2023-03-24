import Link from 'next/link'
import React from 'react'
const Header = () => {
  return (
    <div>
      <header>
        <nav className='flex h-12 justify-between shadow-md items-center'>
          <Link href='/' className='text-lg font-bold '>
            Matthew's Store
          </Link>
          <div>
            <Link href='/cart' className='p-2'>
              Cart
            </Link>
            <Link href='/login' className='p-2'>
              Login
            </Link>
          </div>
        </nav>
      </header>
    </div>
  )
}
export default Header
