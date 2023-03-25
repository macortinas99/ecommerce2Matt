'use client'

import Link from 'next/link'
import React, { useContext } from 'react'
import { Store } from '../../utils/Store'
const Header = () => {
  const { state, dispatch } = useContext(Store)
  const { cart } = state

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
              {cart.cartItems.length > 0 && (
                <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
              )}
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
